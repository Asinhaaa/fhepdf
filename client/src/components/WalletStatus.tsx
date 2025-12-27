/**
 * WalletStatus Component
 * 
 * Displays detailed wallet connection status, network information, and account details.
 * Shows connection state, chain ID, and formatted address.
 * 
 * Design Philosophy: Informative status display with clear visual hierarchy
 */

import React from "react";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Wallet,
  Network,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

interface WalletStatusProps {
  className?: string;
  showDetails?: boolean;
}

/**
 * Component displaying wallet status and network information
 */
export function WalletStatus({
  className = "",
  showDetails = true,
}: WalletStatusProps) {
  const { address, isConnected, chainId, getChainName, formatAddress } =
    useWalletConnection();
  const [copied, setCopied] = useState(false);

  /**
   * Copy address to clipboard
   */
  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success("Address copied");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  /**
   * Check if network is correct (Sepolia)
   */
  const isCorrectNetwork = chainId === 11155111;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              <CardTitle>Wallet Status</CardTitle>
            </div>
            <Badge variant={isConnected ? "default" : "secondary"}>
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
          </div>
          <CardDescription>
            Current wallet and network information
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Connection Status */}
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            {isConnected ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Connected</p>
                  <p className="text-xs text-muted-foreground">
                    Wallet is ready to use
                  </p>
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Disconnected</p>
                  <p className="text-xs text-muted-foreground">
                    Connect a wallet to continue
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Network Warning */}
          {isConnected && !isCorrectNetwork && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please switch to Sepolia testnet to use this application.
              </AlertDescription>
            </Alert>
          )}

          {/* Network Status */}
          {isConnected && (
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Network className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium">{getChainName()}</p>
                <p className="text-xs text-muted-foreground">
                  Chain ID: {chainId}
                </p>
              </div>
              <Badge
                variant={isCorrectNetwork ? "default" : "destructive"}
              >
                {isCorrectNetwork ? "Correct" : "Wrong Network"}
              </Badge>
            </div>
          )}

          {/* Address Display */}
          {isConnected && address && showDetails && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Address
              </p>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-mono break-all">{address}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Formatted: {formatAddress(address)}
                  </p>
                </div>
                <button
                  onClick={handleCopyAddress}
                  className="p-2 hover:bg-background rounded transition-colors flex-shrink-0"
                  title="Copy address"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Details Summary */}
          {isConnected && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-muted rounded">
                <p className="text-muted-foreground mb-1">Status</p>
                <p className="font-medium text-green-600">Active</p>
              </div>
              <div className="p-2 bg-muted rounded">
                <p className="text-muted-foreground mb-1">Network</p>
                <p className="font-medium">{getChainName()}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
