import { useContractRead, useContractWrite } from "wagmi";
import { useAccount } from "wagmi";
import { ethers } from "ethers";

const REGISTRY_ADDRESS = process.env.REACT_APP_REGISTRY_ADDRESS || "";

const REGISTRY_ABI = [
  {
    inputs: [
      { name: "_encryptedHash", type: "bytes32" },
      { name: "_documentType", type: "string" },
      { name: "_fileSize", type: "uint256" },
      { name: "_encryptedMetadata", type: "bytes" },
    ],
    name: "registerDocument",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "_documentId", type: "uint256" },
      { name: "_operationType", type: "string" },
      { name: "_encryptedParams", type: "bytes" },
    ],
    name: "initiateOperation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "_documentId", type: "uint256" }],
    name: "getDocument",
    outputs: [
      {
        components: [
          { name: "id", type: "uint256" },
          { name: "owner", type: "address" },
          { name: "encryptedHash", type: "bytes32" },
          { name: "documentType", type: "string" },
          { name: "fileSize", type: "uint256" },
          { name: "timestamp", type: "uint256" },
          { name: "isProcessed", type: "bool" },
          { name: "encryptedMetadata", type: "bytes" },
        ],
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "_user", type: "address" }],
    name: "getUserDocuments",
    outputs: [{ name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
];

export function useContractInteraction() {
  const { address } = useAccount();

  const registerDocument = async (
    encryptedHash: string,
    documentType: string,
    fileSize: number,
    encryptedMetadata: string
  ) => {
    if (!address || !REGISTRY_ADDRESS) {
      throw new Error("Wallet not connected or contract address not set");
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        REGISTRY_ADDRESS,
        REGISTRY_ABI,
        signer
      );

      const tx = await contract.registerDocument(
        encryptedHash,
        documentType,
        fileSize,
        encryptedMetadata
      );

      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error("Failed to register document:", error);
      throw error;
    }
  };

  const initiateOperation = async (
    documentId: number,
    operationType: string,
    encryptedParams: string
  ) => {
    if (!address || !REGISTRY_ADDRESS) {
      throw new Error("Wallet not connected or contract address not set");
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        REGISTRY_ADDRESS,
        REGISTRY_ABI,
        signer
      );

      const tx = await contract.initiateOperation(
        documentId,
        operationType,
        encryptedParams
      );

      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error("Failed to initiate operation:", error);
      throw error;
    }
  };

  const getDocument = async (documentId: number) => {
    if (!REGISTRY_ADDRESS) {
      throw new Error("Contract address not set");
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        REGISTRY_ADDRESS,
        REGISTRY_ABI,
        provider
      );

      const doc = await contract.getDocument(documentId);
      return doc;
    } catch (error) {
      console.error("Failed to get document:", error);
      throw error;
    }
  };

  const getUserDocuments = async (userAddress: string) => {
    if (!REGISTRY_ADDRESS) {
      throw new Error("Contract address not set");
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        REGISTRY_ADDRESS,
        REGISTRY_ABI,
        provider
      );

      const docs = await contract.getUserDocuments(userAddress);
      return docs;
    } catch (error) {
      console.error("Failed to get user documents:", error);
      throw error;
    }
  };

  return {
    registerDocument,
    initiateOperation,
    getDocument,
    getUserDocuments,
  };
}
