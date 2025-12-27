/**
 * WalletConnectButton Component
 * 
 * Multi-wallet connection button supporting MetaMask, WalletConnect, and Coinbase Wallet.
 * Shows wallet status, address, and network information when connected.
 * 
 * Design Philosophy: Clean, informative wallet connection UI
 */

import React, { useState } from "react";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Wallet, LogOut, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface WalletConnectButtonProps {
  showNetwork?: boolean;
  showBalance?: boolean;
  className?: string;
}

/**
 * Wallet connection button with dropdown menu for wallet selection
 */
export function WalletConnectButton({
  showNetwork = true,
  className = "",
}: WalletConnectButtonProps) {
  const {
    address,
    isConnected,
    isConnecting,
    chainId,
    connectWallet,
    disconnectWallet,
    getChainName,
    formatAddress,
  } = useWalletConnection();

  const [copied, setCopied] = useState(false);

  /**
   * Handle wallet selection from dropdown
   */
  const handleWalletSelect = async (walletName: string) => {
    try {
      await connectWallet(walletName);
    } catch (error) {
      console.error(`Failed to connect ${walletName}:`, error);
      toast.error(`Failed to connect ${walletName}`);
    }
  };

  /**
   * Copy address to clipboard
   */
  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success("Address copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  /**
   * Render connected state
   */
  if (isConnected && address) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className={`gap-2 px-3 py-2 ${className}`}
            >
              <Wallet className="h-4 w-4" />
              <span className="font-mono text-sm font-medium">
                {formatAddress(address)}
              </span>
              {showNetwork && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {getChainName()}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            {/* Address Display */}
            <div className="px-2 py-2">
              <p className="text-xs text-muted-foreground mb-1">Connected</p>
              <div className="flex items-center justify-between gap-2 bg-muted p-2 rounded">
                <code className="text-xs font-mono break-all">{address}</code>
                <button
                  onClick={handleCopyAddress}
                  className="p-1 hover:bg-background rounded transition-colors"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <DropdownMenuSeparator />

            {/* Network Info */}
            {showNetwork && (
              <>
                <div className="px-2 py-2">
                  <p className="text-xs text-muted-foreground mb-1">Network</p>
                  <p className="text-sm font-medium">{getChainName()}</p>
                  <p className="text-xs text-muted-foreground">
                    Chain ID: {chainId}
                  </p>
                </div>
                <DropdownMenuSeparator />
              </>
            )}

            {/* Disconnect */}
            <DropdownMenuItem
              onClick={disconnectWallet}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>
    );
  }

  /**
   * Render disconnected state with wallet selection
   */
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="default"
            className={`gap-2 ${className}`}
            disabled={isConnecting}
          >
            <Wallet className="h-4 w-4" />
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <div className="px-2 py-1.5">
            <p className="text-xs font-semibold text-muted-foreground mb-2">
              SELECT WALLET
            </p>
          </div>

          <DropdownMenuItem onClick={() => handleWalletSelect("MetaMask")}>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                M
              </div>
              <span>MetaMask</span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => handleWalletSelect("WalletConnect")}>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                W
              </div>
              <span>WalletConnect</span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => handleWalletSelect("Coinbase")}>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                C
              </div>
              <span>Coinbase Wallet</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
}
