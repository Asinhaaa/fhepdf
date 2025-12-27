/**
 * SendTransaction Component
 * 
 * Handles sending ETH transactions with form validation and status feedback.
 * Demonstrates transaction lifecycle: pending → confirming → confirmed.
 * 
 * Design Philosophy: Clear transaction flow with detailed status feedback
 */

import React, { useState } from "react";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useTransaction } from "@/hooks/useTransaction";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  AlertCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { isAddress } from "viem";

interface SendTransactionProps {
  defaultRecipient?: string;
  defaultAmount?: string;
  className?: string;
}

/**
 * Component for sending ETH transactions
 */
export function SendTransaction({
  defaultRecipient = "",
  defaultAmount = "0.001",
  className = "",
}: SendTransactionProps) {
  const { address, isConnected } = useWalletConnection();
  const {
    isPending,
    isConfirming,
    isConfirmed,
    error,
    hash,
    sendETH,
    reset,
  } = useTransaction();

  const [recipient, setRecipient] = useState(defaultRecipient);
  const [amount, setAmount] = useState(defaultAmount);
  const [copied, setCopied] = useState(false);

  /**
   * Validate form inputs
   */
  const isFormValid = () => {
    if (!isAddress(recipient)) {
      toast.error("Invalid recipient address");
      return false;
    }
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Amount must be greater than 0");
      return false;
    }
    return true;
  };

  /**
   * Handle transaction submission
   */
  const handleSendTransaction = async () => {
    if (!isFormValid()) return;

    try {
      await sendETH(recipient as `0x${string}`, amount);
      toast.success("Transaction submitted!");
    } catch (err) {
      console.error("Transaction error:", err);
      toast.error("Failed to send transaction");
    }
  };

  /**
   * Copy transaction hash to clipboard
   */
  const handleCopyHash = () => {
    if (hash) {
      navigator.clipboard.writeText(hash);
      setCopied(true);
      toast.success("Hash copied");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  /**
   * Get Sepolia block explorer URL
   */
  const getExplorerUrl = () => {
    if (!hash) return "";
    return `https://sepolia.etherscan.io/tx/${hash}`;
  };

  if (!isConnected) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Send Transaction</CardTitle>
          <CardDescription>
            Connect your wallet to send transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please connect your wallet first to send transactions.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Send Transaction
        </CardTitle>
        <CardDescription>
          Send ETH on Sepolia testnet (0.001 ETH example)
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Status Messages */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          {isConfirmed && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Transaction confirmed! ✓
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {isConfirming && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Alert className="border-blue-200 bg-blue-50">
                <Clock className="h-4 w-4 text-blue-600 animate-spin" />
                <AlertDescription className="text-blue-800">
                  Confirming transaction on blockchain...
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {isPending && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Alert className="border-amber-200 bg-amber-50">
                <Clock className="h-4 w-4 text-amber-600 animate-spin" />
                <AlertDescription className="text-amber-800">
                  Waiting for wallet confirmation...
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transaction Hash Display */}
        <AnimatePresence>
          {hash && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-muted p-4 rounded-lg space-y-2"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Transaction Hash:</p>
                <Badge variant="outline">
                  {isConfirmed ? "Confirmed" : isConfirming ? "Confirming" : "Pending"}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <code className="text-xs font-mono break-all flex-1">{hash}</code>
                <button
                  onClick={handleCopyHash}
                  className="p-1 hover:bg-background rounded transition-colors"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
              <a
                href={getExplorerUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
              >
                View on Sepolia Etherscan
                <ExternalLink className="h-3 w-3" />
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        {!isConfirmed && (
          <div className="space-y-4">
            {/* Sender Info */}
            <div>
              <Label className="text-xs text-muted-foreground">From</Label>
              <div className="mt-1 p-3 bg-muted rounded text-sm font-mono">
                {address}
              </div>
            </div>

            {/* Recipient Address */}
            <div>
              <Label htmlFor="recipient" className="text-sm font-medium">
                Recipient Address
              </Label>
              <Input
                id="recipient"
                placeholder="0x..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                disabled={isPending || isConfirming}
                className="mt-1 font-mono text-sm"
              />
              {recipient && !isAddress(recipient) && (
                <p className="text-xs text-destructive mt-1">
                  Invalid Ethereum address
                </p>
              )}
            </div>

            {/* Amount */}
            <div>
              <Label htmlFor="amount" className="text-sm font-medium">
                Amount (ETH)
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.001"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isPending || isConfirming}
                step="0.0001"
                min="0"
                className="mt-1"
              />
            </div>

            {/* Send Button */}
            <Button
              onClick={handleSendTransaction}
              disabled={
                isPending ||
                isConfirming ||
                !isAddress(recipient) ||
                !amount ||
                parseFloat(amount) <= 0
              }
              className="w-full gap-2"
              size="lg"
            >
              <Send className="h-4 w-4" />
              {isPending ? "Confirming..." : "Send Transaction"}
            </Button>

            {/* Reset Button */}
            {(error || isConfirmed) && (
              <Button
                onClick={reset}
                variant="outline"
                className="w-full"
              >
                Reset
              </Button>
            )}
          </div>
        )}

        {/* Confirmed State - Reset Button */}
        {isConfirmed && (
          <Button
            onClick={reset}
            className="w-full"
            size="lg"
          >
            Send Another Transaction
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
