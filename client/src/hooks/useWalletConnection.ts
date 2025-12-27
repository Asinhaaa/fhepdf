/**
 * useWalletConnection Hook
 * 
 * Provides wallet connection state and methods for connecting/disconnecting.
 * Handles wallet address, network information, and connection status.
 * 
 * Design Philosophy: Simple, composable wallet state management
 */

import { useAccount, useConnect, useDisconnect, useChainId } from "wagmi";
import { useCallback } from "react";

export interface UseWalletConnectionReturn {
  address: `0x${string}` | undefined;
  isConnected: boolean;
  chainId: number | undefined;
  isConnecting: boolean;
  connectWallet: (connectorName?: string) => Promise<void>;
  disconnectWallet: () => void;
  getChainName: () => string;
  formatAddress: (addr?: string) => string;
}

/**
 * Hook to manage wallet connection state and operations
 * 
 * @returns Wallet connection state and methods
 */
export function useWalletConnection(): UseWalletConnectionReturn {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();

  /**
   * Connect wallet using specified connector or first available
   * @param connectorName - Optional connector name (e.g., "MetaMask", "WalletConnect", "Coinbase")
   */
  const connectWallet = useCallback(
    async (connectorName?: string) => {
      try {
        const targetConnector = connectorName
          ? connectors.find(
              (c) =>
                c.name.toLowerCase() === connectorName.toLowerCase() ||
                c.id === connectorName
            )
          : connectors[0];

        if (!targetConnector) {
          throw new Error(
            `Connector not found: ${connectorName || "default"}`
          );
        }

        connect({ connector: targetConnector });
      } catch (error) {
        console.error("Failed to connect wallet:", error);
        throw error;
      }
    },
    [connect, connectors]
  );

  /**
   * Disconnect wallet
   */
  const disconnectWallet = useCallback(() => {
    disconnect();
  }, [disconnect]);

  /**
   * Get human-readable chain name
   */
  const getChainName = useCallback((): string => {
    if (chainId === 11155111) return "Sepolia";
    if (chainId === 1) return "Ethereum Mainnet";
    if (chainId === 5) return "Goerli";
    return "Unknown Network";
  }, [chainId]);

  /**
   * Format address for display (0x1234...5678)
   */
  const formatAddress = useCallback((addr?: string): string => {
    const targetAddr = addr || address;
    if (!targetAddr) return "";
    return `${targetAddr.slice(0, 6)}...${targetAddr.slice(-4)}`;
  }, [address]);

  return {
    address,
    isConnected,
    chainId,
    isConnecting,
    connectWallet,
    disconnectWallet,
    getChainName,
    formatAddress,
  };
}
