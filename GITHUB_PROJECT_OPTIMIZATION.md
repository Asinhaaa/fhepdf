# GitHub Project Optimization Guide

This document provides optimization recommendations for the existing FHE PDF project (https://github.com/Asinhaaa/fhepdf).

## Current State Analysis

The existing project (`fhepdf`) is a comprehensive FHE (Fully Homomorphic Encryption) PDF processing system with:

- **Existing Web3 Integration**: Uses wagmi and RainbowKit for wallet connections
- **Architecture**: Full-stack with Next.js, Drizzle ORM, and tRPC
- **Wallet Support**: Basic MetaMask support via RainbowKit
- **Limitations**: 
  - Limited to RainbowKit's built-in connectors
  - No custom transaction handling
  - No Sepolia testnet configuration
  - No multi-wallet flexibility

## Recommended Optimizations

### 1. Upgrade Wallet Connection System

**Current Implementation** (`WalletProvider.tsx`):
```tsx
const config = createConfig(
  getDefaultConfig({
    appName: "FheDF - Privacy-First PDF Toolkit",
    projectId: process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID || "",
    chains: [mainnet, sepolia],
    transports: { ... }
  })
);
```

**Issues**:
- Relies on RainbowKit's opinionated defaults
- Limited customization of connectors
- No explicit control over wallet selection

**Recommended Upgrade**:
```tsx
import { injected, walletConnect, coinbaseWallet } from "@wagmi/connectors";

const config = createConfig({
  chains: [sepolia],
  connectors: [
    injected(),
    walletConnect({
      projectId: process.env.VITE_WALLETCONNECT_PROJECT_ID,
    }),
    coinbaseWallet({
      appName: "FheDF",
    }),
  ],
  transports: {
    [sepolia.id]: http(process.env.VITE_SEPOLIA_RPC_URL),
  },
});
```

**Benefits**:
- Full control over wallet connectors
- Explicit Sepolia testnet support
- Support for MetaMask, WalletConnect, and Coinbase
- Smaller bundle size (no RainbowKit overhead)

### 2. Replace useContractInteraction Hook

**Current Issues**:
- Uses deprecated wagmi hooks (`useContractRead`, `useContractWrite`)
- Mixes ethers.js with wagmi
- No error handling or state management
- No transaction status tracking

**Recommended Replacement**:
```tsx
import { useContractWrite, useWaitForTransactionReceipt } from "wagmi";
import { useMutation } from "@tanstack/react-query";

export function useContractInteraction() {
  const { writeContract, isPending } = useContractWrite();
  const { data: receipt } = useWaitForTransactionReceipt();

  const registerDocument = useMutation({
    mutationFn: async (params: RegisterDocumentParams) => {
      return writeContract({
        address: REGISTRY_ADDRESS,
        abi: REGISTRY_ABI,
        functionName: "registerDocument",
        args: [params.hash, params.type, params.size, params.metadata],
      });
    },
  });

  return { registerDocument, isPending, receipt };
}
```

**Benefits**:
- Uses current wagmi API
- Proper error handling
- React Query integration for caching
- Better TypeScript support

### 3. Implement Transaction Status Component

**Current Gap**:
- No visual feedback for transaction lifecycle
- No block explorer links
- No confirmation tracking

**Recommended Implementation**:
```tsx
export function TransactionStatus({ hash, chainId }) {
  const { data: receipt } = useWaitForTransactionReceipt({ hash });
  
  return (
    <div>
      {!receipt && <Spinner />}
      {receipt && <CheckCircle />}
      <a href={getExplorerUrl(hash, chainId)}>
        View on Etherscan
      </a>
    </div>
  );
}
```

### 4. Add Network Validation

**Current Gap**:
- No check for correct network
- Users can attempt operations on wrong chain

**Recommended Addition**:
```tsx
const { chainId } = useWalletConnection();
const isCorrectNetwork = chainId === 11155111; // Sepolia

if (!isCorrectNetwork) {
  return <Alert>Please switch to Sepolia testnet</Alert>;
}
```

### 5. Optimize useWalletConnection Hook

**Current Implementation**:
```tsx
export function useWalletConnection() {
  const { address, isConnected, chainId } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const connectWallet = async () => {
    try {
      connect({ connector: injected() });
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  return { address, isConnected, chainId, connectWallet, disconnectWallet };
}
```

**Issues**:
- No support for multiple connectors
- No address formatting
- No chain name resolution
- Minimal error handling

**Recommended Enhancement**:
```tsx
export function useWalletConnection() {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const connectWallet = useCallback(
    async (connectorName?: string) => {
      const connector = connectorName
        ? connectors.find(c => c.name.toLowerCase() === connectorName.toLowerCase())
        : connectors[0];
      
      if (!connector) throw new Error("Connector not found");
      connect({ connector });
    },
    [connect, connectors]
  );

  const getChainName = useCallback(() => {
    if (chainId === 11155111) return "Sepolia";
    if (chainId === 1) return "Ethereum";
    return "Unknown";
  }, [chainId]);

  const formatAddress = useCallback((addr?: string) => {
    const target = addr || address;
    if (!target) return "";
    return `${target.slice(0, 6)}...${target.slice(-4)}`;
  }, [address]);

  return {
    address,
    isConnected,
    chainId,
    connectWallet,
    disconnectWallet: () => disconnect(),
    getChainName,
    formatAddress,
  };
}
```

### 6. Add Transaction Hooks

**Current Gap**:
- No dedicated transaction management
- Manual ethers.js usage
- No state tracking

**Recommended Addition**:
```tsx
export function useTransaction() {
  const { sendTransaction, isPending } = useSendTransaction();
  const { data: hash } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash });

  const sendETH = useCallback(async (to: string, amount: string) => {
    sendTransaction({
      to,
      value: parseEther(amount),
    });
  }, [sendTransaction]);

  return {
    sendETH,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
  };
}
```

### 7. Upgrade Dependencies

**Current Versions** (from package.json):
```json
"wagmi": "^3.1.3",  // Latest
"viem": "^2.43.3",  // Latest
"@rainbow-me/rainbowkit": "^1.x.x"  // Can be removed
```

**Recommended**:
- Remove `@rainbow-me/rainbowkit` (not needed with custom UI)
- Keep wagmi and viem at latest versions
- Ensure TypeScript >= 5.7.3

### 8. Improve Error Handling

**Current Gap**:
- Generic error messages
- No error categorization
- No retry logic

**Recommended**:
```tsx
export function useErrorHandler() {
  const handleError = (error: Error) => {
    if (error.message.includes("insufficient balance")) {
      return "Insufficient balance. Get Sepolia ETH from faucet.";
    }
    if (error.message.includes("user rejected")) {
      return "Transaction rejected by user.";
    }
    if (error.message.includes("network")) {
      return "Network error. Please check your connection.";
    }
    return error.message;
  };

  return { handleError };
}
```

### 9. Add TypeScript Strict Mode

**Current**: May not have strict TypeScript enabled

**Recommended**:
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true
  }
}
```

### 10. Add Testing

**Current Gap**:
- No tests for wallet integration
- No RPC endpoint validation

**Recommended**:
```tsx
describe("Web3 Integration", () => {
  it("should connect to Sepolia RPC", async () => {
    const response = await fetch(process.env.VITE_SEPOLIA_RPC_URL, {
      method: "POST",
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_chainId",
        params: [],
        id: 1,
      }),
    });
    expect(response.ok).toBe(true);
  });

  it("should validate wallet addresses", () => {
    expect(isAddress("0x742d35Cc6634C0532925a3b844Bc9e7595f42bE")).toBe(true);
    expect(isAddress("invalid")).toBe(false);
  });
});
```

## Migration Path

### Phase 1: Prepare
1. Create feature branch: `git checkout -b feat/web3-optimization`
2. Update dependencies: `pnpm add wagmi@latest viem@latest`
3. Remove RainbowKit if not needed elsewhere

### Phase 2: Update Hooks
1. Replace `useWalletConnection.ts` with enhanced version
2. Replace `useContractInteraction.ts` with new implementation
3. Add `useTransaction.ts` hook
4. Add `useErrorHandler.ts` hook

### Phase 3: Update Components
1. Update `WalletProvider.tsx` with new config
2. Create `WalletConnectButton.tsx` component
3. Create `TransactionStatus.tsx` component
4. Update existing components to use new hooks

### Phase 4: Testing
1. Add vitest configuration
2. Write integration tests
3. Test all wallet connectors
4. Verify Sepolia testnet connectivity

### Phase 5: Documentation
1. Update README with new API
2. Add code examples
3. Document migration steps
4. Add troubleshooting guide

## Performance Improvements

### Bundle Size
- Remove RainbowKit: ~50KB reduction
- Use tree-shaking: Ensure unused code is removed
- Code splitting: Lazy load wallet components

### Runtime Performance
- Memoize callbacks: Use `useCallback` for wallet operations
- Optimize re-renders: Use `useMemo` for expensive computations
- Batch updates: Use React 18 automatic batching

### Network Performance
- Cache RPC responses: Use React Query with appropriate stale times
- Reduce RPC calls: Combine multiple calls where possible
- Use multicall: For reading multiple contract values

## Security Considerations

1. **Never expose private keys**: Always use wallet provider
2. **Validate addresses**: Use viem's `isAddress` utility
3. **Verify chain ID**: Always check correct network before transactions
4. **Rate limiting**: Implement rate limiting for RPC calls
5. **Error messages**: Don't expose sensitive information in errors

## Rollback Plan

If issues arise:

```bash
# Revert to previous state
git revert <commit-hash>

# Or reset to last working commit
git reset --hard <working-commit>

# Reinstall dependencies
pnpm install
```

## Success Metrics

After optimization:
- ✓ All wallet connectors working (MetaMask, WalletConnect, Coinbase)
- ✓ Transaction lifecycle properly tracked
- ✓ Error handling comprehensive
- ✓ TypeScript strict mode enabled
- ✓ Tests passing (>80% coverage)
- ✓ Bundle size reduced by 50KB+
- ✓ No breaking changes for existing features

## References

- [Wagmi v3 Migration Guide](https://wagmi.sh/react/guides/migrate-from-v1-to-v2)
- [Viem Documentation](https://viem.sh)
- [Ethereum Development Best Practices](https://ethereum.org/en/developers/docs/smart-contracts/security/)
- [Web3 Security Checklist](https://blog.openzeppelin.com/security-audit-checklist/)
