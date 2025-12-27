/**
 * ContractDeployer Component
 * 
 * Deploy smart contracts to Sepolia testnet with bytecode and constructor args.
 * Tracks deployment status and provides contract address on success.
 * 
 * Design Philosophy: Simple, robust contract deployment UI
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
import { Textarea } from "@/components/ui/textarea";
import {
  Send,
  AlertCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Copy,
  Check,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface ContractDeployerProps {
  className?: string;
}

/**
 * Component for deploying smart contracts
 */
export function ContractDeployer({ className = "" }: ContractDeployerProps) {
  const { address, isConnected, chainId } = useWalletConnection();
  const { isPending, isConfirming, isConfirmed, error, hash, sendTransaction, reset } =
    useTransaction();

  const [bytecode, setBytecode] = useState("");
  const [constructorArgs, setConstructorArgs] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [copied, setCopied] = useState(false);

  const isCorrectNetwork = chainId === 11155111;

  /**
   * Validate bytecode format
   */
  const isValidBytecode = () => {
    if (!bytecode) return false;
    const cleaned = bytecode.replace(/^0x/, "").toLowerCase();
    return /^[0-9a-f]*$/.test(cleaned) && cleaned.length > 0;
  };

  /**
   * Handle contract deployment
   */
  const handleDeploy = async () => {
    if (!isConnected) {
      toast.error("Connect wallet first");
      return;
    }

    if (!isCorrectNetwork) {
      toast.error("Please switch to Sepolia testnet");
      return;
    }

    if (!isValidBytecode()) {
      toast.error("Invalid bytecode format");
      return;
    }

    try {
      // Prepare bytecode with constructor args
      let deployData = bytecode.startsWith("0x") ? bytecode : `0x${bytecode}`;
      
      if (constructorArgs.trim()) {
        deployData += constructorArgs.replace(/^0x/, "");
      }

      // Send deployment transaction (to address 0x0 for contract creation)
      await sendTransaction("0x0000000000000000000000000000000000000000" as `0x${string}`, deployData as `0x${string}`);
      toast.success("Deployment transaction submitted!");
    } catch (err) {
      console.error("Deployment error:", err);
      toast.error("Failed to deploy contract");
    }
  };

  /**
   * Copy contract address to clipboard
   */
  const handleCopyAddress = () => {
    if (contractAddress) {
      navigator.clipboard.writeText(contractAddress);
      setCopied(true);
      toast.success("Address copied");
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
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Deploy Contract
          </CardTitle>
          <CardDescription>
            Deploy smart contracts to Sepolia testnet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please connect your wallet first to deploy contracts.
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
          <Zap className="h-5 w-5" />
          Deploy Contract
        </CardTitle>
        <CardDescription>
          Deploy smart contracts to Sepolia testnet
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
                  Contract deployment confirmed! ✓
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
                  Confirming deployment on blockchain...
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

        {/* Network Warning */}
        {!isCorrectNetwork && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please switch to Sepolia testnet to deploy contracts.
            </AlertDescription>
          </Alert>
        )}

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
                <p className="text-sm font-medium">Deployment Hash:</p>
                <Badge variant="outline">
                  {isConfirmed ? "Confirmed" : isConfirming ? "Confirming" : "Pending"}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <code className="text-xs font-mono break-all flex-1">{hash}</code>
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
            {/* Deployer Address */}
            <div>
              <Label className="text-xs text-muted-foreground">From (Deployer)</Label>
              <div className="mt-1 p-3 bg-muted rounded text-sm font-mono">
                {address}
              </div>
            </div>

            {/* Bytecode */}
            <div>
              <Label htmlFor="bytecode" className="text-sm font-medium">
                Contract Bytecode
              </Label>
              <Textarea
                id="bytecode"
                placeholder="0x60806040... or paste compiled bytecode"
                value={bytecode}
                onChange={(e) => setBytecode(e.target.value)}
                disabled={isPending || isConfirming}
                className="mt-1 font-mono text-xs"
                rows={6}
              />
              {bytecode && !isValidBytecode() && (
                <p className="text-xs text-destructive mt-1">
                  Invalid bytecode format (must be hex)
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Paste the compiled bytecode from your contract (with or without 0x prefix)
              </p>
            </div>

            {/* Constructor Arguments (Optional) */}
            <div>
              <Label htmlFor="constructorArgs" className="text-sm font-medium">
                Constructor Arguments (Optional)
              </Label>
              <Textarea
                id="constructorArgs"
                placeholder="0x... (encoded constructor parameters)"
                value={constructorArgs}
                onChange={(e) => setConstructorArgs(e.target.value)}
                disabled={isPending || isConfirming}
                className="mt-1 font-mono text-xs"
                rows={3}
              />
              <p className="text-xs text-muted-foreground mt-1">
                ABI-encoded constructor parameters (if any)
              </p>
            </div>

            {/* Deploy Button */}
            <Button
              onClick={handleDeploy}
              disabled={
                isPending ||
                isConfirming ||
                !isValidBytecode() ||
                !isCorrectNetwork
              }
              className="w-full gap-2"
              size="lg"
            >
              <Send className="h-4 w-4" />
              {isPending ? "Confirming..." : "Deploy Contract"}
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
            Deploy Another Contract
          </Button>
        )}

        {/* Example Section */}
        <div className="bg-muted p-4 rounded-lg space-y-2">
          <p className="text-sm font-medium">Example Simple Contract:</p>
          <pre className="text-xs overflow-x-auto bg-slate-900 text-slate-50 p-2 rounded">
{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleCounter {
  uint256 public count = 0;
  
  function increment() public {
    count += 1;
  }
}`}
          </pre>
          <p className="text-xs text-muted-foreground">
            Compile with Solidity compiler and paste the bytecode above
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
