# Web3 Wallet Integration Guide

Complete guide for integrating the Web3 wallet connection system into your application.

## Table of Contents

1. [Basic Setup](#basic-setup)
2. [Component Integration](#component-integration)
3. [Hook Usage](#hook-usage)
4. [Advanced Examples](#advanced-examples)
5. [Error Handling](#error-handling)
6. [Testing](#testing)

## Basic Setup

### Step 1: Install Dependencies

```bash
pnpm install wagmi viem @wagmi/connectors @tanstack/react-query
```

### Step 2: Wrap App with WalletProvider

```tsx
// src/App.tsx
import { WalletProvider } from "@/components/WalletProvider";

function App() {
  return (
    <WalletProvider>
      <YourApp />
    </WalletProvider>
  );
}
```

### Step 3: Configure Environment

Create `.env.local`:

```env
VITE_WALLETCONNECT_PROJECT_ID=your_project_id
VITE_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
```

## Component Integration

### Add Wallet Connect Button to Header

```tsx
// src/components/Header.tsx
import { WalletConnectButton } from "@/components/WalletConnectButton";

export function Header() {
  return (
    <header className="flex items-center justify-between p-4">
      <h1>My Web3 App</h1>
      <WalletConnectButton showNetwork={true} />
    </header>
  );
}
```

### Display Wallet Status

```tsx
// src/components/Dashboard.tsx
import { WalletStatus } from "@/components/WalletStatus";

export function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <WalletStatus showDetails={true} />
      {/* Other dashboard components */}
    </div>
  );
}
```

### Add Transaction Form

```tsx
// src/pages/Transfer.tsx
import { SendTransaction } from "@/components/SendTransaction";

export default function TransferPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1>Send ETH</h1>
      <SendTransaction
        defaultRecipient="0x742d35Cc6634C0532925a3b844Bc9e7595f42bE"
        defaultAmount="0.001"
      />
    </div>
  );
}
```

## Hook Usage

### useWalletConnection Hook

#### Basic Connection

```tsx
import { useWalletConnection } from "@/hooks/useWalletConnection";

function ConnectButton() {
  const { isConnected, connectWallet, disconnectWallet } = useWalletConnection();

  return (
    <button onClick={isConnected ? disconnectWallet : connectWallet}>
      {isConnected ? "Disconnect" : "Connect Wallet"}
    </button>
  );
}
```

#### Display User Address

```tsx
function UserProfile() {
  const { address, isConnected, formatAddress } = useWalletConnection();

  if (!isConnected) return <p>Not connected</p>;

  return (
    <div>
      <p>Full Address: {address}</p>
      <p>Formatted: {formatAddress(address)}</p>
    </div>
  );
}
```

#### Check Network

```tsx
function NetworkStatus() {
  const { chainId, getChainName } = useWalletConnection();

  return (
    <div>
      <p>Network: {getChainName()}</p>
      <p>Chain ID: {chainId}</p>
      {chainId !== 11155111 && (
        <p className="text-red-600">Please switch to Sepolia</p>
      )}
    </div>
  );
}
```

#### Select Specific Wallet

```tsx
function WalletSelector() {
  const { connectWallet } = useWalletConnection();

  return (
    <div className="flex gap-2">
      <button onClick={() => connectWallet("MetaMask")}>
        Connect MetaMask
      </button>
      <button onClick={() => connectWallet("WalletConnect")}>
        Connect WalletConnect
      </button>
      <button onClick={() => connectWallet("Coinbase")}>
        Connect Coinbase
      </button>
    </div>
  );
}
```

### useTransaction Hook

#### Send ETH

```tsx
import { useTransaction } from "@/hooks/useTransaction";
import { useState } from "react";

function SendETHForm() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("0.001");
  const { sendETH, isPending, isConfirmed, hash } = useTransaction();

  const handleSend = async () => {
    try {
      await sendETH(recipient as `0x${string}`, amount);
    } catch (error) {
      console.error("Failed to send:", error);
    }
  };

  return (
    <div>
      <input
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        placeholder="Recipient address"
      />
      <input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount in ETH"
      />
      <button onClick={handleSend} disabled={isPending}>
        {isPending ? "Sending..." : "Send"}
      </button>
      {hash && <p>Transaction: {hash}</p>}
      {isConfirmed && <p>✓ Confirmed!</p>}
    </div>
  );
}
```

#### Track Transaction Status

```tsx
function TransactionTracker() {
  const { isPending, isConfirming, isConfirmed, error, hash } = useTransaction();

  return (
    <div>
      {isPending && <p>⏳ Waiting for wallet confirmation...</p>}
      {isConfirming && <p>⛓️ Transaction being mined...</p>}
      {isConfirmed && <p>✅ Transaction confirmed!</p>}
      {error && <p>❌ Error: {error.message}</p>}
      {hash && (
        <a href={`https://sepolia.etherscan.io/tx/${hash}`} target="_blank">
          View on Etherscan
        </a>
      )}
    </div>
  );
}
```

## Advanced Examples

### Protected Route for Connected Users

```tsx
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { Navigate } from "wouter";

function ProtectedPage() {
  const { isConnected } = useWalletConnection();

  if (!isConnected) {
    return <Navigate to="/connect" />;
  }

  return <div>Protected content</div>;
}
```

### Multi-Step Transaction

```tsx
function MultiStepTransaction() {
  const { address, isConnected } = useWalletConnection();
  const { sendETH, isPending, isConfirmed, hash } = useTransaction();
  const [step, setStep] = useState(1);

  const handleStep1 = async () => {
    // Validate inputs
    if (!address) return;
    setStep(2);
  };

  const handleStep2 = async () => {
    // Send transaction
    await sendETH("0x742d35Cc6634C0532925a3b844Bc9e7595f42bE", "0.001");
    setStep(3);
  };

  return (
    <div>
      {step === 1 && (
        <button onClick={handleStep1}>
          Step 1: Verify Wallet ({address})
        </button>
      )}
      {step === 2 && (
        <button onClick={handleStep2} disabled={isPending}>
          Step 2: Send Transaction
        </button>
      )}
      {step === 3 && (
        <div>
          <p>✓ Transaction sent: {hash}</p>
          {isConfirmed && <p>✓ Confirmed!</p>}
        </div>
      )}
    </div>
  );
}
```

### Batch Operations

```tsx
async function batchTransactions() {
  const { sendETH } = useTransaction();

  const recipients = [
    "0x742d35Cc6634C0532925a3b844Bc9e7595f42bE",
    "0x1234567890123456789012345678901234567890",
  ];

  for (const recipient of recipients) {
    try {
      await sendETH(recipient as `0x${string}`, "0.001");
      // Wait for confirmation before next transaction
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`Failed to send to ${recipient}:`, error);
    }
  }
}
```

### Conditional Rendering Based on Network

```tsx
function NetworkAwareComponent() {
  const { chainId, isConnected } = useWalletConnection();

  if (!isConnected) {
    return <p>Connect wallet to continue</p>;
  }

  if (chainId !== 11155111) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 rounded">
        <p>Please switch to Sepolia testnet</p>
        <p>Current chain ID: {chainId}</p>
      </div>
    );
  }

  return <div>✓ Connected to Sepolia</div>;
}
```

## Error Handling

### Comprehensive Error Handling

```tsx
import { toast } from "sonner";
import { isAddress } from "viem";

function SafeTransactionForm() {
  const { address, isConnected, chainId } = useWalletConnection();
  const { sendETH, error } = useTransaction();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  const handleSend = async () => {
    // Validation checks
    if (!isConnected) {
      toast.error("Please connect wallet first");
      return;
    }

    if (chainId !== 11155111) {
      toast.error("Please switch to Sepolia testnet");
      return;
    }

    if (!isAddress(recipient)) {
      toast.error("Invalid recipient address");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Invalid amount");
      return;
    }

    try {
      await sendETH(recipient as `0x${string}`, amount);
      toast.success("Transaction sent!");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Failed: ${message}`);
    }
  };

  return (
    <div>
      <input
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        placeholder="0x..."
      />
      <input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="0.001"
      />
      <button onClick={handleSend}>Send</button>
      {error && <p className="text-red-600">{error.message}</p>}
    </div>
  );
}
```

### Error Recovery

```tsx
function TransactionWithRetry() {
  const { sendETH, error, reset } = useTransaction();
  const [retryCount, setRetryCount] = useState(0);

  const handleRetry = async () => {
    if (retryCount >= 3) {
      toast.error("Max retries reached");
      return;
    }

    reset();
    setRetryCount(retryCount + 1);
    await sendETH("0x742d35Cc6634C0532925a3b844Bc9e7595f42bE", "0.001");
  };

  return (
    <div>
      {error && (
        <div>
          <p>Error: {error.message}</p>
          <button onClick={handleRetry}>
            Retry ({retryCount}/3)
          </button>
        </div>
      )}
    </div>
  );
}
```

## Testing

### Unit Test Example

```tsx
// src/hooks/__tests__/useWalletConnection.test.ts
import { renderHook, act } from "@testing-library/react";
import { useWalletConnection } from "@/hooks/useWalletConnection";

describe("useWalletConnection", () => {
  it("should format address correctly", () => {
    const { result } = renderHook(() => useWalletConnection());

    const formatted = result.current.formatAddress(
      "0x742d35Cc6634C0532925a3b844Bc9e7595f42bE"
    );

    expect(formatted).toBe("0x742d...42bE");
  });

  it("should return correct chain name for Sepolia", () => {
    const { result } = renderHook(() => useWalletConnection());

    // Mock chainId to 11155111 (Sepolia)
    const chainName = result.current.getChainName();

    expect(chainName).toBeDefined();
  });
});
```

### Integration Test Example

```tsx
// src/__tests__/wallet-integration.test.ts
import { describe, it, expect, beforeAll } from "vitest";

describe("Wallet Integration", () => {
  let rpcUrl: string;

  beforeAll(() => {
    rpcUrl = import.meta.env.VITE_SEPOLIA_RPC_URL;
  });

  it("should connect to Sepolia RPC", async () => {
    const response = await fetch(rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_chainId",
        params: [],
        id: 1,
      }),
    });

    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data.result).toBe("0xaa36a7"); // Sepolia chain ID
  });

  it("should validate addresses", () => {
    import { isAddress } from "viem";

    expect(isAddress("0x742d35Cc6634C0532925a3b844Bc9e7595f42bE")).toBe(true);
    expect(isAddress("invalid")).toBe(false);
  });
});
```

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Sepolia RPC URL verified
- [ ] WalletConnect Project ID obtained
- [ ] All tests passing
- [ ] Build completes without errors
- [ ] Components tested in browser
- [ ] Error handling verified
- [ ] Transaction flow tested
- [ ] Network switching tested
- [ ] Mobile wallet support tested

## Common Issues

### "Connector not found"

**Cause**: Wallet not installed or not supported

**Solution**: Install wallet extension or use WalletConnect

### "Wrong network"

**Cause**: User on different blockchain

**Solution**: Show network switch prompt

### "Insufficient balance"

**Cause**: Not enough ETH for transaction

**Solution**: Direct to faucet for free Sepolia ETH

### "RPC Error"

**Cause**: Network connectivity or RPC provider issue

**Solution**: Check RPC URL and provider status

## Next Steps

1. Review the [README.md](./README.md) for API reference
2. Check [GITHUB_PROJECT_OPTIMIZATION.md](./GITHUB_PROJECT_OPTIMIZATION.md) for optimization tips
3. Explore example components in `client/src/components/`
4. Run tests: `pnpm test`
5. Start development: `pnpm dev`

## Support

For issues or questions:
- Check the troubleshooting section in README.md
- Review test files for usage examples
- Consult wagmi and viem documentation
