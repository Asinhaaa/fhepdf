# Web3 Wallet Connection System

A production-ready Web3 wallet connection system built with React, Next.js, wagmi, and viem. Supports MetaMask, WalletConnect, and Coinbase Wallet on Ethereum Sepolia testnet.

## Features

- **Multi-Wallet Support**: Connect with MetaMask, WalletConnect, or Coinbase Wallet
- **Send Transactions**: Send ETH transactions with full status tracking and error handling
- **Network Management**: Automatic network detection and switching guidance
- **Production Ready**: Comprehensive error handling, state management, and TypeScript support
- **Reusable Components**: Clean, composable React components and hooks
- **Responsive Design**: Mobile-first UI with Tailwind CSS and shadcn/ui

## Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **wagmi** | ^3.1.3 | React hooks for Ethereum |
| **viem** | ^2.43.3 | TypeScript Ethereum library |
| **@wagmi/connectors** | ^7.0.5 | Wallet connectors (MetaMask, WalletConnect, Coinbase) |
| **React Query** | ^5.90.12 | Data fetching and caching |
| **React** | ^19.2.1 | UI framework |
| **Tailwind CSS** | ^4.1.14 | Utility-first CSS |
| **Framer Motion** | ^12.23.22 | Animations and transitions |
| **Sonner** | ^2.0.7 | Toast notifications |
| **TypeScript** | ^5.7.3 | Type safety |

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment Variables

Create a `.env.local` file with the following variables:

```env
# WalletConnect Project ID (get from https://cloud.walletconnect.com)
VITE_WALLETCONNECT_PROJECT_ID=your_project_id

# Sepolia RPC URL (get from Infura, Alchemy, or other providers)
VITE_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY

# Optional: Application branding
VITE_APP_TITLE=Web3 Wallet System
VITE_APP_LOGO=https://your-domain.com/logo.png
```

### 3. Get Sepolia Testnet ETH

Visit one of these faucets to get free Sepolia ETH:
- [Alchemy Faucet](https://www.alchemy.com/faucets/ethereum-sepolia)
- [Infura Faucet](https://www.infura.io/faucet/sepolia)
- [Sepolia Faucet](https://sepoliafaucet.com/)

### 4. Start Development Server

```bash
pnpm dev
```

Visit `http://localhost:3000` in your browser.

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── WalletProvider.tsx          # Wagmi configuration provider
│   │   ├── WalletConnectButton.tsx     # Multi-wallet connection button
│   │   ├── WalletStatus.tsx            # Wallet status display
│   │   ├── SendTransaction.tsx         # Transaction sending form
│   │   └── ui/                         # shadcn/ui components
│   ├── hooks/
│   │   ├── useWalletConnection.ts      # Wallet connection state hook
│   │   ├── useTransaction.ts           # Transaction management hook
│   │   └── __tests__/
│   │       └── walletConnection.test.ts # Configuration tests
│   ├── pages/
│   │   ├── Home.tsx                    # Main demo page
│   │   └── NotFound.tsx                # 404 page
│   ├── contexts/
│   │   └── ThemeContext.tsx            # Dark/light theme
│   ├── App.tsx                         # Root component
│   ├── main.tsx                        # React entry point
│   └── index.css                       # Global styles
├── public/                             # Static assets
└── index.html                          # HTML template

server/
└── index.ts                            # Express server (static serving)

shared/
└── const.ts                            # Shared constants
```

## Core Components

### WalletProvider

Configures wagmi with wallet connectors and React Query:

```tsx
import { WalletProvider } from "@/components/WalletProvider";

function App() {
  return (
    <WalletProvider>
      <YourApp />
    </WalletProvider>
  );
}
```

### useWalletConnection Hook

Manage wallet connection state:

```tsx
import { useWalletConnection } from "@/hooks/useWalletConnection";

function MyComponent() {
  const {
    address,
    isConnected,
    chainId,
    connectWallet,
    disconnectWallet,
    getChainName,
    formatAddress,
  } = useWalletConnection();

  return (
    <div>
      {isConnected ? (
        <p>Connected: {formatAddress(address)}</p>
      ) : (
        <button onClick={() => connectWallet("MetaMask")}>
          Connect MetaMask
        </button>
      )}
    </div>
  );
}
```

### useTransaction Hook

Send on-chain transactions:

```tsx
import { useTransaction } from "@/hooks/useTransaction";

function SendETH() {
  const { isPending, isConfirmed, hash, sendETH, error } = useTransaction();

  const handleSend = async () => {
    try {
      await sendETH("0x742d35Cc6634C0532925a3b844Bc9e7595f42bE", "0.001");
    } catch (err) {
      console.error("Transaction failed:", err);
    }
  };

  return (
    <div>
      {error && <p>Error: {error.message}</p>}
      {hash && <p>Transaction: {hash}</p>}
      <button onClick={handleSend} disabled={isPending}>
        {isPending ? "Sending..." : "Send 0.001 ETH"}
      </button>
    </div>
  );
}
```

### WalletConnectButton

Pre-built wallet connection button:

```tsx
import { WalletConnectButton } from "@/components/WalletConnectButton";

export default function Header() {
  return (
    <header>
      <h1>My App</h1>
      <WalletConnectButton showNetwork={true} />
    </header>
  );
}
```

### WalletStatus

Display wallet and network information:

```tsx
import { WalletStatus } from "@/components/WalletStatus";

export default function Dashboard() {
  return (
    <div>
      <WalletStatus showDetails={true} />
    </div>
  );
}
```

### SendTransaction

Complete transaction form component:

```tsx
import { SendTransaction } from "@/components/SendTransaction";

export default function TransferPage() {
  return (
    <SendTransaction
      defaultRecipient="0x742d35Cc6634C0532925a3b844Bc9e7595f42bE"
      defaultAmount="0.001"
    />
  );
}
```

## Wallet Connectors

### MetaMask

The injected connector automatically detects MetaMask:

```tsx
await connectWallet("MetaMask");
```

### WalletConnect

Requires a WalletConnect Project ID from https://cloud.walletconnect.com:

```tsx
await connectWallet("WalletConnect");
```

### Coinbase Wallet

Built-in support for Coinbase Wallet:

```tsx
await connectWallet("Coinbase");
```

## Transaction Lifecycle

1. **Pending**: User confirms transaction in wallet
2. **Confirming**: Transaction is being mined on blockchain
3. **Confirmed**: Transaction is finalized with receipt

```tsx
const { isPending, isConfirming, isConfirmed, hash } = useTransaction();

// isPending: User hasn't confirmed in wallet yet
// isConfirming: Transaction is in mempool/being mined
// isConfirmed: Transaction is finalized
// hash: Transaction hash for block explorer
```

## Error Handling

All components include comprehensive error handling:

```tsx
const { error, sendETH } = useTransaction();

try {
  await sendETH(recipient, amount);
} catch (err) {
  console.error("Failed to send transaction:", err);
  // Handle error (show toast, retry, etc.)
}
```

Common errors:
- **Invalid address**: Recipient address format is incorrect
- **Insufficient balance**: Not enough ETH to send transaction
- **Wrong network**: User is on wrong blockchain
- **User rejected**: User cancelled transaction in wallet
- **RPC error**: Network connectivity issue

## Testing

Run the test suite:

```bash
pnpm test
```

Tests validate:
- Environment variables are configured
- Sepolia RPC endpoint is accessible
- Chain ID is correct (11155111 for Sepolia)

## Deployment

### Build for Production

```bash
pnpm build
```

This generates optimized static files in `dist/public/`.

### Environment Variables for Production

Ensure these variables are set in your production environment:

```env
VITE_WALLETCONNECT_PROJECT_ID=your_production_project_id
VITE_SEPOLIA_RPC_URL=your_production_rpc_url
VITE_APP_TITLE=Your App Title
VITE_APP_LOGO=https://your-domain.com/logo.png
```

### Deploy to Manus

1. Create a checkpoint:
```bash
git add .
git commit -m "Production build"
```

2. Click the "Publish" button in the Manus UI

3. Your site will be available at `https://your-app.manus.space`

### Deploy to Other Platforms

The project can be deployed to any static hosting:

- **Vercel**: `vercel deploy`
- **Netlify**: `netlify deploy --prod`
- **GitHub Pages**: Push to `gh-pages` branch
- **AWS S3**: Upload `dist/public/` contents

## Best Practices

### 1. Always Check Network

Before sending transactions, verify the user is on Sepolia:

```tsx
const { chainId } = useWalletConnection();

if (chainId !== 11155111) {
  toast.error("Please switch to Sepolia testnet");
  return;
}
```

### 2. Validate Addresses

Use viem's `isAddress` utility:

```tsx
import { isAddress } from "viem";

if (!isAddress(recipient)) {
  toast.error("Invalid address");
  return;
}
```

### 3. Handle All Transaction States

Show appropriate UI for each state:

```tsx
const { isPending, isConfirming, isConfirmed, error } = useTransaction();

if (error) return <ErrorAlert />;
if (isPending) return <PendingSpinner />;
if (isConfirming) return <ConfirmingSpinner />;
if (isConfirmed) return <SuccessMessage />;
```

### 4. Use TypeScript

Leverage type safety for addresses and amounts:

```tsx
const sendTransaction = async (
  to: `0x${string}`,
  amount: string
): Promise<void> => {
  // Type-safe implementation
};
```

### 5. Provide User Feedback

Always show transaction status and links to block explorer:

```tsx
const explorerUrl = `https://sepolia.etherscan.io/tx/${hash}`;
<a href={explorerUrl} target="_blank">
  View on Etherscan
</a>
```

## Troubleshooting

### "Connector not found" Error

Make sure the wallet is installed in your browser:
- MetaMask: https://metamask.io
- WalletConnect: Use mobile wallet with WalletConnect support
- Coinbase Wallet: https://www.coinbase.com/wallet

### "Wrong network" Error

Switch to Sepolia testnet in your wallet settings.

### "Insufficient balance" Error

Get free Sepolia ETH from a faucet:
- https://www.alchemy.com/faucets/ethereum-sepolia
- https://www.infura.io/faucet/sepolia

### RPC Connection Issues

Verify your RPC URL is correct and the provider is accessible:
```bash
curl -X POST https://sepolia.infura.io/v3/YOUR_KEY \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}'
```

## API Reference

### useWalletConnection()

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

### useTransaction()

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

## Resources

- **Wagmi Documentation**: https://wagmi.sh
- **Viem Documentation**: https://viem.sh
- **Sepolia Testnet**: https://sepolia.etherscan.io
- **Sepolia Faucet**: https://www.alchemy.com/faucets/ethereum-sepolia
- **WalletConnect**: https://cloud.walletconnect.com
- **Ethereum Development**: https://ethereum.org/en/developers

## License

MIT

## Support

For issues, questions, or contributions, please refer to the project repository.
