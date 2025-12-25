# FheDF FHEVM Integration Guide

## Overview

FheDF has been upgraded to a full **FHEVM-compatible dApp** with on-chain smart contracts, wallet connection, and encrypted state management. This guide explains the architecture and how to deploy and use the system.

---

## Architecture

### Smart Contracts (Solidity)

**Location**: `/contracts/EncryptedPdfRegistry.sol`

The core contract manages encrypted PDF documents and FHE operations:

- **`registerDocument()`**: Register an encrypted PDF with metadata
- **`initiateOperation()`**: Start an FHE operation (merge, split, compress, convert)
- **`completeOperation()`**: Complete an operation and store encrypted result
- **`getDocument()`**: Retrieve document details
- **`getUserDocuments()`**: Get all documents owned by a user

### Frontend Integration

**Wallet Connection**: Uses **Rainbow Kit** + **Wagmi** for MetaMask and other wallet support.

**Contract Interaction**: Custom hooks in `/client/src/hooks/`:
- `useWalletConnection.ts`: Manage wallet state
- `useContractInteraction.ts`: Call smart contract functions

**Updated FHE Playground**: `/client/src/pages/FhePlaygroundV3.tsx`
- Encrypt/decrypt on-chain
- Register results to the blockchain
- Real-time transaction status

---

## Deployment Instructions

### 1. Deploy Smart Contracts

```bash
# Set your private key
export PRIVATE_KEY="your_private_key_here"

# Deploy to FHEVM testnet
npx hardhat deploy --network fhevm

# Verify on block explorer (if applicable)
npx hardhat verify --network fhevm <CONTRACT_ADDRESS>
```

### 2. Update Environment Variables

Create a `.env` file in the root:

```env
REACT_APP_REGISTRY_ADDRESS=0x<your_contract_address>
REACT_APP_WALLET_CONNECT_PROJECT_ID=<your_walletconnect_id>
```

### 3. Build and Deploy Frontend

```bash
# Install dependencies
pnpm install

# Build
pnpm run build

# Deploy to Vercel
vercel deploy --prod
```

---

## Key Features

### 1. Wallet Connection

Users can connect their MetaMask wallet directly from the FHE Playground:

```typescript
import { useAccount } from "wagmi";

const { address, isConnected } = useAccount();
```

### 2. On-Chain Encryption

Encrypted data is registered on-chain with immutable proof:

```typescript
const receipt = await registerDocument(
  encryptedHash,
  "fhe-computation",
  fileSize,
  encryptedMetadata
);
```

### 3. Zero-Knowledge Proofs

All operations maintain privacy while enabling verification:
- Encrypted data never decrypted on-chain
- Only owners can access their documents
- Verifiable computation results

---

## Smart Contract Functions

### registerDocument

```solidity
function registerDocument(
    bytes32 _encryptedHash,
    string memory _documentType,
    uint256 _fileSize,
    bytes memory _encryptedMetadata
) public returns (uint256)
```

**Parameters**:
- `_encryptedHash`: Hash of encrypted content
- `_documentType`: Type (pdf, docx, image, fhe-computation)
- `_fileSize`: Size of encrypted file
- `_encryptedMetadata`: Additional encrypted metadata

**Returns**: Document ID

### initiateOperation

```solidity
function initiateOperation(
    uint256 _documentId,
    string memory _operationType,
    bytes memory _encryptedParams
) public
```

**Parameters**:
- `_documentId`: ID of document to operate on
- `_operationType`: Type (merge, split, compress, convert)
- `_encryptedParams`: Encrypted operation parameters

### completeOperation

```solidity
function completeOperation(
    uint256 _documentId,
    uint256 _operationIndex,
    bytes32 _resultHash
) public onlyOwner
```

**Parameters**:
- `_documentId`: ID of document
- `_operationIndex`: Index of operation
- `_resultHash`: Hash of encrypted result

---

## Frontend Integration

### Using the Contract Interaction Hook

```typescript
import { useContractInteraction } from "@/hooks/useContractInteraction";

function MyComponent() {
  const { registerDocument, initiateOperation } = useContractInteraction();

  const handleRegister = async () => {
    const receipt = await registerDocument(
      encryptedHash,
      "pdf",
      fileSize,
      encryptedMetadata
    );
    console.log("Document registered:", receipt);
  };

  return <button onClick={handleRegister}>Register</button>;
}
```

### Wallet Status

```typescript
import { useAccount } from "wagmi";

function WalletStatus() {
  const { address, isConnected } = useAccount();

  if (!isConnected) return <p>Connect wallet</p>;
  return <p>Connected: {address}</p>;
}
```

---

## Testing

### Local Testing

```bash
# Start Hardhat local network
npx hardhat node

# In another terminal, deploy to local network
npx hardhat deploy --network localhost

# Run frontend dev server
cd client && pnpm run dev
```

### Testnet Testing

```bash
# Deploy to FHEVM testnet
npx hardhat deploy --network fhevm

# Update .env with contract address
# Test via frontend at https://fhedf.vercel.app
```

---

## Security Considerations

1. **Private Keys**: Never commit `.env` files with private keys
2. **Contract Audits**: Have contracts audited before mainnet deployment
3. **Encryption**: Use proper FHE libraries (SEAL, Zama's TFHE-rs)
4. **Rate Limiting**: Implement on-chain rate limiting for operations
5. **Access Control**: Only owners can access their documents

---

## Troubleshooting

### Contract Not Found

Ensure `REACT_APP_REGISTRY_ADDRESS` is set correctly in `.env`

### Wallet Connection Issues

- Clear browser cache
- Ensure MetaMask is installed
- Check network is set to FHEVM testnet

### Transaction Failures

- Check gas limits
- Verify account has sufficient balance
- Ensure contract is deployed on correct network

---

## Next Steps

1. Deploy contracts to FHEVM testnet
2. Update environment variables
3. Test wallet connection
4. Register and encrypt documents
5. Monitor on-chain operations

---

## Resources

- **FHEVM Docs**: https://docs.zama.ai/fhevm
- **Hardhat Docs**: https://hardhat.org
- **Wagmi Docs**: https://wagmi.sh
- **Rainbow Kit**: https://www.rainbowkit.com

---

**FheDF: Privacy-First PDF Toolkit on FHEVM** 🚀🔒
