/**
 * WalletProvider Component
 * 
 * Configures wagmi with support for MetaMask, WalletConnect, and Coinbase Wallet.
 * Supports Ethereum Sepolia testnet for development and testing.
 * 
 * Design Philosophy: Transparent, production-ready Web3 infrastructure
 */

import React from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { injected, walletConnect, coinbaseWallet } from "@wagmi/connectors";

// Initialize React Query client for caching and state management
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    },
  },
});

/**
 * Create wagmi configuration with multiple wallet connectors
 * 
 * Connectors included:
 * - injected: MetaMask and other injected wallets
 * - walletConnect: WalletConnect protocol for mobile wallets
 * - coinbaseWallet: Coinbase Wallet connector
 */
const config = createConfig({
  chains: [sepolia],
  connectors: [
    injected(),
    walletConnect({
      projectId: process.env.VITE_WALLETCONNECT_PROJECT_ID || "default-project-id",
    }),
    coinbaseWallet({
      appName: "Web3 Wallet System",
      appLogoUrl: process.env.VITE_APP_LOGO || "",
    }),
  ],
  transports: {
    [sepolia.id]: http(
      process.env.VITE_SEPOLIA_RPC_URL ||
        "https://sepolia.infura.io/v3/YOUR_INFURA_KEY"
    ),
  },
});

interface WalletProviderProps {
  children: React.ReactNode;
}

/**
 * Wrapper component that provides wagmi and React Query context
 * to all child components in the application
 */
export function WalletProvider({ children }: WalletProviderProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
