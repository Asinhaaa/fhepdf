# API Reference

Complete API documentation for the Web3 wallet connection system.

## Table of Contents

- [Components](#components)
- [Hooks](#hooks)
- [Types](#types)
- [Utilities](#utilities)

## Components

### WalletProvider

Configures wagmi with wallet connectors and React Query.

**Props:**
```tsx
interface WalletProviderProps {
  children: React.ReactNode;
}
```

**Usage:**
```tsx
<WalletProvider>
  <App />
</WalletProvider>
```

**Features:**
- Configures MetaMask, WalletConnect, and Coinbase Wallet connectors
- Sets up React Query for caching
- Provides wagmi context to child components

---

### WalletConnectButton

Multi-wallet connection button with dropdown menu.

**Props:**
```tsx
interface WalletConnectButtonProps {
  showNetwork?: boolean;      // Show network badge (default: true)
  className?: string;         // Additional CSS classes
}
```

**Usage:**
```tsx
<WalletConnectButton showNetwork={true} />
```

**States:**
- **Disconnected**: Shows "Connect Wallet" button with wallet options
- **Connected**: Shows formatted address and network badge
- **Connecting**: Shows loading state

**Features:**
- Dropdown menu for wallet selection
- Copy address to clipboard
- Disconnect option
- Network display
- Smooth animations

---

### WalletStatus

Displays wallet connection status and network information.

**Props:**
```tsx
interface WalletStatusProps {
  className?: string;         // Additional CSS classes
  showDetails?: boolean;      // Show full address details (default: true)
}
```

**Usage:**
```tsx
<WalletStatus showDetails={true} />
```

**Displays:**
- Connection status (connected/disconnected)
- Network name and chain ID
- Full wallet address with copy button
- Network validation (correct/wrong network)

---

### SendTransaction

Complete transaction form component.

**Props:**
```tsx
interface SendTransactionProps {
  defaultRecipient?: string;  // Pre-filled recipient address
  defaultAmount?: string;     // Pre-filled amount in ETH (default: "0.001")
  className?: string;         // Additional CSS classes
}
```

**Usage:**
```tsx
<SendTransaction
  defaultRecipient="0x742d35Cc6634C0532925a3b844Bc9e7595f42bE"
  defaultAmount="0.001"
/>
```

**Features:**
- Address validation
- Amount input with validation
- Transaction status tracking
- Transaction hash display
- Link to block explorer
- Error handling and display
- Copy transaction hash
- Reset form after transaction

---

## Hooks

### useWalletConnection

Manages wallet connection state and operations.

**Returns:**
```tsx
interface UseWalletConnectionReturn {
  address: `0x${string}` | undefined;
  isConnected: boolean;
  chainId: number | undefined;
  isConnecting: boolean;
  connectWallet: (connectorName?: string) => Promise<void>;
  disconnectWallet: () => void;
  getChainName: () => string;
  formatAddress: (addr?: string) => string;
}
```

**Methods:**

#### `connectWallet(connectorName?: string)`
Connect wallet using specified connector.

**Parameters:**
- `connectorName` (optional): "MetaMask", "WalletConnect", or "Coinbase"

**Example:**
```tsx
const { connectWallet } = useWalletConnection();

// Auto-select first available connector
await connectWallet();

// Select specific connector
await connectWallet("MetaMask");
```

**Throws:**
- Error if connector not found
- Error if connection fails

---

#### `disconnectWallet()`
Disconnect current wallet.

**Example:**
```tsx
const { disconnectWallet } = useWalletConnection();
disconnectWallet();
```

---

#### `getChainName()`
Get human-readable chain name.

**Returns:** String (e.g., "Sepolia", "Ethereum Mainnet")

**Example:**
```tsx
const { getChainName } = useWalletConnection();
const chainName = getChainName(); // "Sepolia"
```

---

#### `formatAddress(addr?: string)`
Format address for display (0x1234...5678).

**Parameters:**
- `addr` (optional): Address to format (uses connected address if not provided)

**Returns:** Formatted address string

**Example:**
```tsx
const { formatAddress } = useWalletConnection();
const formatted = formatAddress("0x742d35Cc6634C0532925a3b844Bc9e7595f42bE");
// Returns: "0x742d...42bE"
```

---

### useTransaction

Manages transaction lifecycle and status.

**Returns:**
```tsx
interface UseTransactionReturn {
  isPending: boolean;
  isConfirming: boolean;
  isConfirmed: boolean;
  error: Error | null;
  hash: `0x${string}` | undefined;
  sendETH: (to: `0x${string}`, amount: string) => Promise<void>;
  sendTransaction: (to: `0x${string}`, data?: `0x${string}`) => Promise<void>;
  reset: () => void;
}
```

**States:**

| State | Meaning |
|-------|---------|
| `isPending` | Waiting for wallet confirmation |
| `isConfirming` | Transaction in mempool/being mined |
| `isConfirmed` | Transaction finalized |
| `error` | Transaction error (if any) |
| `hash` | Transaction hash (once submitted) |

---

#### `sendETH(to: string, amount: string)`
Send ETH to an address.

**Parameters:**
- `to`: Recipient address (0x format)
- `amount`: Amount in ETH as string (e.g., "0.001")

**Example:**
```tsx
const { sendETH } = useTransaction();

try {
  await sendETH("0x742d35Cc6634C0532925a3b844Bc9e7595f42bE", "0.001");
} catch (error) {
  console.error("Failed:", error);
}
```

**Throws:**
- Error if address is invalid
- Error if amount is invalid
- Error if transaction fails

---

#### `sendTransaction(to: string, data?: string)`
Send transaction with optional data (for contract interactions).

**Parameters:**
- `to`: Recipient or contract address
- `data` (optional): Transaction data for contract calls

**Example:**
```tsx
const { sendTransaction } = useTransaction();

// Simple transfer
await sendTransaction("0x742d35Cc6634C0532925a3b844Bc9e7595f42bE");

// Contract interaction
await sendTransaction(
  "0xContractAddress",
  "0x1234..." // Encoded function call
);
```

---

#### `reset()`
Reset transaction state.

**Example:**
```tsx
const { reset } = useTransaction();
reset(); // Clear error and prepare for new transaction
```

---

## Types

### Address Type

```tsx
type Address = `0x${string}`;
```

All address parameters use this type for type safety.

---

### Transaction States

```tsx
enum TransactionState {
  Idle = "idle",
  Pending = "pending",      // Waiting for wallet confirmation
  Confirming = "confirming", // Being mined
  Confirmed = "confirmed",   // Finalized
  Failed = "failed"          // Transaction failed
}
```

---

### Chain IDs

```tsx
const CHAIN_IDS = {
  SEPOLIA: 11155111,
  ETHEREUM: 1,
  GOERLI: 5,
} as const;
```

---

## Utilities

### isAddress (from viem)

Validate Ethereum address format.

**Usage:**
```tsx
import { isAddress } from "viem";

isAddress("0x742d35Cc6634C0532925a3b844Bc9e7595f42bE"); // true
isAddress("invalid"); // false
```

---

### parseEther (from viem)

Convert ETH string to wei.

**Usage:**
```tsx
import { parseEther } from "viem";

parseEther("0.001"); // 1000000000000000n (in wei)
parseEther("1");     // 1000000000000000000n
```

---

### formatEther (from viem)

Convert wei to ETH string.

**Usage:**
```tsx
import { formatEther } from "viem";

formatEther(1000000000000000n);   // "0.001"
formatEther(1000000000000000000n); // "1.0"
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_WALLETCONNECT_PROJECT_ID` | Yes | WalletConnect project ID from https://cloud.walletconnect.com |
| `VITE_SEPOLIA_RPC_URL` | Yes | Sepolia RPC endpoint (Infura, Alchemy, etc.) |
| `VITE_APP_TITLE` | No | Application title for branding |
| `VITE_APP_LOGO` | No | Application logo URL |

---

## Error Types

### Common Errors

```tsx
// Invalid address
Error: "Invalid recipient address"

// Insufficient balance
Error: "Insufficient balance"

// User rejected
Error: "User rejected transaction"

// Network error
Error: "Network error. Please check your connection."

// Wrong network
Error: "Please switch to Sepolia testnet"

// Wallet not found
Error: "Connector not found: MetaMask"
```

---

## Complete Example

```tsx
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useTransaction } from "@/hooks/useTransaction";
import { isAddress } from "viem";
import { toast } from "sonner";

function TransferApp() {
  const {
    address,
    isConnected,
    chainId,
    connectWallet,
    formatAddress,
  } = useWalletConnection();

  const {
    sendETH,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    error,
    reset,
  } = useTransaction();

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("0.001");

  const handleSend = async () => {
    // Validation
    if (!isConnected) {
      toast.error("Connect wallet first");
      return;
    }

    if (chainId !== 11155111) {
      toast.error("Switch to Sepolia");
      return;
    }

    if (!isAddress(recipient)) {
      toast.error("Invalid address");
      return;
    }

    // Send transaction
    try {
      await sendETH(recipient as `0x${string}`, amount);
      toast.success("Transaction sent!");
    } catch (err) {
      toast.error("Transaction failed");
    }
  };

  return (
    <div>
      {!isConnected ? (
        <button onClick={() => connectWallet()}>Connect</button>
      ) : (
        <>
          <p>Connected: {formatAddress(address)}</p>
          <input
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Recipient"
          />
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
          />
          <button onClick={handleSend} disabled={isPending || isConfirming}>
            {isPending ? "Confirming..." : isConfirming ? "Mining..." : "Send"}
          </button>
          {hash && <p>Hash: {hash}</p>}
          {isConfirmed && <p>✓ Confirmed!</p>}
          {error && <p>Error: {error.message}</p>}
        </>
      )}
    </div>
  );
}
```

---

## Migration from RainbowKit

If migrating from RainbowKit:

### Before (RainbowKit)
```tsx
import { ConnectButton } from "@rainbow-me/rainbowkit";

<ConnectButton />
```

### After (Custom)
```tsx
import { WalletConnectButton } from "@/components/WalletConnectButton";

<WalletConnectButton showNetwork={true} />
```

**Benefits:**
- Smaller bundle size
- Full customization control
- Better TypeScript support
- No external dependencies

---

## Performance Tips

1. **Memoize callbacks**: Use `useCallback` for event handlers
2. **Lazy load components**: Use `React.lazy` for wallet components
3. **Cache RPC calls**: React Query handles this automatically
4. **Batch operations**: Combine multiple RPC calls when possible

---

## Browser Support

- Chrome/Edge: ✓ Full support
- Firefox: ✓ Full support
- Safari: ✓ Full support (with MetaMask extension)
- Mobile: ✓ WalletConnect support

---

## Resources

- [Wagmi Documentation](https://wagmi.sh)
- [Viem Documentation](https://viem.sh)
- [Ethereum JSON-RPC API](https://ethereum.org/en/developers/docs/apis/json-rpc/)
- [Sepolia Testnet](https://sepolia.etherscan.io)
