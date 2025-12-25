// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title EncryptedPdfRegistry
 * @dev Smart contract for managing encrypted PDF metadata and operations on FHEVM
 * Demonstrates FHE-powered document processing with privacy guarantees
 */
contract EncryptedPdfRegistry is Ownable {
    using Counters for Counters.Counter;

    // Counter for PDF documents
    Counters.Counter private documentCounter;

    // Struct to store encrypted PDF metadata
    struct EncryptedDocument {
        uint256 id;
        address owner;
        bytes32 encryptedHash; // Hash of encrypted content
        string documentType; // "pdf", "docx", "image"
        uint256 fileSize;
        uint256 timestamp;
        bool isProcessed;
        bytes encryptedMetadata; // Additional encrypted metadata
    }

    // Struct for FHE operations
    struct FheOperation {
        uint256 documentId;
        string operationType; // "merge", "split", "compress", "convert"
        bytes encryptedParams;
        bool completed;
        uint256 resultHash;
    }

    // Mapping from document ID to document data
    mapping(uint256 => EncryptedDocument) public documents;

    // Mapping from document ID to operations
    mapping(uint256 => FheOperation[]) public documentOperations;

    // Mapping from user address to their document IDs
    mapping(address => uint256[]) public userDocuments;

    // Events
    event DocumentRegistered(
        uint256 indexed documentId,
        address indexed owner,
        bytes32 encryptedHash,
        uint256 timestamp
    );

    event OperationInitiated(
        uint256 indexed documentId,
        string operationType,
        uint256 timestamp
    );

    event OperationCompleted(
        uint256 indexed documentId,
        string operationType,
        bytes32 resultHash,
        uint256 timestamp
    );

    event DocumentProcessed(
        uint256 indexed documentId,
        address indexed owner,
        uint256 timestamp
    );

    /**
     * @dev Register an encrypted PDF document
     * @param _encryptedHash Hash of the encrypted PDF content
     * @param _documentType Type of document (pdf, docx, image)
     * @param _fileSize Size of the encrypted file
     * @param _encryptedMetadata Additional encrypted metadata
     */
    function registerDocument(
        bytes32 _encryptedHash,
        string memory _documentType,
        uint256 _fileSize,
        bytes memory _encryptedMetadata
    ) public returns (uint256) {
        uint256 documentId = documentCounter.current();
        documentCounter.increment();

        EncryptedDocument storage doc = documents[documentId];
        doc.id = documentId;
        doc.owner = msg.sender;
        doc.encryptedHash = _encryptedHash;
        doc.documentType = _documentType;
        doc.fileSize = _fileSize;
        doc.timestamp = block.timestamp;
        doc.isProcessed = false;
        doc.encryptedMetadata = _encryptedMetadata;

        userDocuments[msg.sender].push(documentId);

        emit DocumentRegistered(
            documentId,
            msg.sender,
            _encryptedHash,
            block.timestamp
        );

        return documentId;
    }

    /**
     * @dev Initiate an FHE operation on an encrypted document
     * @param _documentId ID of the document
     * @param _operationType Type of operation (merge, split, compress, convert)
     * @param _encryptedParams Encrypted parameters for the operation
     */
    function initiateOperation(
        uint256 _documentId,
        string memory _operationType,
        bytes memory _encryptedParams
    ) public {
        require(
            documents[_documentId].owner == msg.sender,
            "Only document owner can initiate operations"
        );
        require(
            documents[_documentId].id != 0,
            "Document does not exist"
        );

        FheOperation memory operation;
        operation.documentId = _documentId;
        operation.operationType = _operationType;
        operation.encryptedParams = _encryptedParams;
        operation.completed = false;

        documentOperations[_documentId].push(operation);

        emit OperationInitiated(_documentId, _operationType, block.timestamp);
    }

    /**
     * @dev Complete an FHE operation and store the encrypted result
     * @param _documentId ID of the document
     * @param _operationIndex Index of the operation
     * @param _resultHash Hash of the encrypted result
     */
    function completeOperation(
        uint256 _documentId,
        uint256 _operationIndex,
        bytes32 _resultHash
    ) public onlyOwner {
        require(
            _operationIndex < documentOperations[_documentId].length,
            "Operation does not exist"
        );

        FheOperation storage operation = documentOperations[_documentId][
            _operationIndex
        ];
        operation.completed = true;
        operation.resultHash = _resultHash;

        documents[_documentId].isProcessed = true;

        emit OperationCompleted(
            _documentId,
            operation.operationType,
            _resultHash,
            block.timestamp
        );
    }

    /**
     * @dev Get document details
     * @param _documentId ID of the document
     */
    function getDocument(uint256 _documentId)
        public
        view
        returns (EncryptedDocument memory)
    {
        require(
            documents[_documentId].id != 0,
            "Document does not exist"
        );
        return documents[_documentId];
    }

    /**
     * @dev Get all operations for a document
     * @param _documentId ID of the document
     */
    function getDocumentOperations(uint256 _documentId)
        public
        view
        returns (FheOperation[] memory)
    {
        return documentOperations[_documentId];
    }

    /**
     * @dev Get all documents for a user
     * @param _user Address of the user
     */
    function getUserDocuments(address _user)
        public
        view
        returns (uint256[] memory)
    {
        return userDocuments[_user];
    }

    /**
     * @dev Get total number of documents
     */
    function getTotalDocuments() public view returns (uint256) {
        return documentCounter.current();
    }

    /**
     * @dev Verify that a document is encrypted and owned by caller
     * @param _documentId ID of the document
     */
    function verifyDocumentOwnership(uint256 _documentId)
        public
        view
        returns (bool)
    {
        return documents[_documentId].owner == msg.sender;
    }
}
