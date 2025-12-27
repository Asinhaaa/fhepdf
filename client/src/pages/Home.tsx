/**
 * Home Page - Web3 Wallet Connection System
 * 
 * Demonstrates all wallet connection and transaction features:
 * - Multi-wallet connection (MetaMask, WalletConnect, Coinbase)
 * - Wallet status display
 * - Send ETH transactions
 * - Network switching
 * - Error handling
 */

import React from "react";
import { WalletConnectButton } from "@/components/WalletConnectButton";
import { WalletStatus } from "@/components/WalletStatus";
import { SendTransaction } from "@/components/SendTransaction";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Wallet,
  Zap,
  Shield,
  Code2,
  ExternalLink,
  Github,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { isConnected, chainId } = useWalletConnection();
  const isCorrectNetwork = chainId === 11155111;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Web3 Wallet System</h1>
              <p className="text-xs text-muted-foreground">
                Production-ready wallet connection
              </p>
            </div>
          </div>

          <WalletConnectButton showNetwork={true} />
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Hero Section */}
          <motion.section variants={itemVariants} className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold tracking-tight">
                Connect Your Wallet
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl">
                A production-ready Web3 wallet connection system supporting MetaMask,
                WalletConnect, and Coinbase Wallet on Ethereum Sepolia testnet.
              </p>
            </div>

            {/* Network Warning */}
            {isConnected && !isCorrectNetwork && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please switch to Sepolia testnet in your wallet to use this application.
                </AlertDescription>
              </Alert>
            )}

            {/* Success Message */}
            {isConnected && isCorrectNetwork && (
              <Alert className="border-green-200 bg-green-50">
                <Wallet className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  ✓ Wallet connected successfully on Sepolia testnet
                </AlertDescription>
              </Alert>
            )}
          </motion.section>

          {/* Features Grid */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h3 className="text-2xl font-bold">Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  icon: Wallet,
                  title: "Multi-Wallet Support",
                  description:
                    "Connect with MetaMask, WalletConnect, or Coinbase Wallet",
                },
                {
                  icon: Zap,
                  title: "Send Transactions",
                  description:
                    "Send ETH transactions with full status tracking",
                },
                {
                  icon: Shield,
                  title: "Production Ready",
                  description:
                    "Error handling, network switching, and state management",
                },
              ].map((feature, idx) => (
                <Card key={idx} className="border-slate-200 dark:border-slate-800">
                  <CardHeader>
                    <feature.icon className="h-6 w-6 text-blue-600 mb-2" />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.section>

          {/* Main Sections */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h3 className="text-2xl font-bold">Get Started</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Wallet Status */}
              <div className="lg:col-span-1">
                <WalletStatus showDetails={true} />
              </div>

              {/* Send Transaction */}
              <div className="lg:col-span-2">
                <SendTransaction
                  defaultRecipient="0x742d35Cc6634C0532925a3b844Bc9e7595f42bE"
                  defaultAmount="0.001"
                />
              </div>
            </div>
          </motion.section>

          {/* Code Examples */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h3 className="text-2xl font-bold">Code Examples</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* useWalletConnection Hook */}
              <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Code2 className="h-4 w-4" />
                    useWalletConnection Hook
                  </CardTitle>
                  <CardDescription>
                    Manage wallet connection state
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-slate-900 text-slate-50 p-3 rounded text-xs overflow-x-auto">
                    {`const {
  address,
  isConnected,
  chainId,
  connectWallet,
  disconnectWallet,
  getChainName,
  formatAddress
} = useWalletConnection();`}
                  </pre>
                </CardContent>
              </Card>

              {/* useTransaction Hook */}
              <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Code2 className="h-4 w-4" />
                    useTransaction Hook
                  </CardTitle>
                  <CardDescription>
                    Send on-chain transactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-slate-900 text-slate-50 p-3 rounded text-xs overflow-x-auto">
                    {`const {
  isPending,
  isConfirmed,
  hash,
  sendETH,
  error
} = useTransaction();

await sendETH(
  recipient,
  "0.001"
);`}
                  </pre>
                </CardContent>
              </Card>
            </div>
          </motion.section>

          {/* Tech Stack */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h3 className="text-2xl font-bold">Technology Stack</h3>
            <Card className="border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle>Dependencies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { name: "wagmi", version: "^3.1.3" },
                    { name: "viem", version: "^2.43.3" },
                    { name: "@wagmi/connectors", version: "^7.0.5" },
                    { name: "React Query", version: "^5.90.12" },
                    { name: "React", version: "^19.2.1" },
                    { name: "Tailwind CSS", version: "^4.1.14" },
                    { name: "Framer Motion", version: "^12.23.22" },
                    { name: "Sonner", version: "^2.0.7" },
                  ].map((dep, idx) => (
                    <div key={idx} className="p-2 bg-muted rounded">
                      <p className="text-sm font-medium">{dep.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {dep.version}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* Documentation Links */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h3 className="text-2xl font-bold">Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: "Wagmi Documentation",
                  url: "https://wagmi.sh",
                  icon: ExternalLink,
                },
                {
                  title: "Viem Documentation",
                  url: "https://viem.sh",
                  icon: ExternalLink,
                },
                {
                  title: "Sepolia Testnet Faucet",
                  url: "https://www.alchemy.com/faucets/ethereum-sepolia",
                  icon: ExternalLink,
                },
                {
                  title: "Sepolia Etherscan",
                  url: "https://sepolia.etherscan.io",
                  icon: ExternalLink,
                },
              ].map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <Card className="border-slate-200 dark:border-slate-800 hover:border-blue-400 transition-colors cursor-pointer h-full">
                    <CardContent className="p-4 flex items-center justify-between">
                      <span className="font-medium text-sm">{link.title}</span>
                      <link.icon className="h-4 w-4 text-muted-foreground group-hover:text-blue-600 transition-colors" />
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </motion.section>

          {/* Footer */}
          <motion.footer
            variants={itemVariants}
            className="border-t border-slate-200 dark:border-slate-800 pt-8 mt-12"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                <p>
                  Production-ready Web3 wallet connection system built with React,
                  wagmi, and viem
                </p>
              </div>
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm hover:text-blue-600 transition-colors"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
              </div>
            </div>
          </motion.footer>
        </motion.div>
      </main>
    </div>
  );
}
