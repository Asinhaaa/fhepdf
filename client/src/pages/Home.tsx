import React from "react";
import { WalletConnectButton } from "@/components/WalletConnectButton";
import { WalletStatus } from "@/components/WalletStatus";
import { SendTransaction } from "@/components/SendTransaction";
import { ContractDeployer } from "@/components/ContractDeployer";
import { useWalletConnection } from "@/hooks/useWalletConnection";

export default function Home() {
  const { isConnected, chainId } = useWalletConnection();
  const isCorrectNetwork = chainId === 11155111;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Web3 Wallet System</h1>
            <p className="text-sm text-gray-600">Production-ready wallet connection</p>
          </div>
          <WalletConnectButton showNetwork={true} />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="space-y-8">
          {/* Hero */}
          <section className="space-y-4">
            <h2 className="text-4xl font-bold">Connect Your Wallet</h2>
            <p className="text-lg text-gray-600 max-w-2xl">
              A production-ready Web3 wallet connection system supporting MetaMask,
              WalletConnect, and Coinbase Wallet on Ethereum Sepolia testnet.
            </p>
            
            {!isCorrectNetwork && isConnected && (
              <div className="p-4 bg-red-100 border border-red-400 rounded text-red-800">
                Please switch to Sepolia testnet to use this application.
              </div>
            )}

            {isConnected && isCorrectNetwork && (
              <div className="p-4 bg-green-100 border border-green-400 rounded text-green-800">
                ✓ Wallet connected successfully on Sepolia testnet
              </div>
            )}
          </section>

          {/* Main Grid */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Wallet Status */}
            <div className="lg:col-span-1">
              <WalletStatus showDetails={true} />
            </div>

            {/* Transactions & Deployment */}
            <div className="lg:col-span-2 space-y-6">
              <SendTransaction
                defaultRecipient="0x742d35Cc6634C0532925a3b844Bc9e7595f42bE"
                defaultAmount="0.001"
              />
              <ContractDeployer />
            </div>
          </section>

          {/* Features */}
          <section className="space-y-4">
            <h3 className="text-2xl font-bold">Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white border border-gray-200 rounded-lg">
                <h4 className="font-bold mb-2">Multi-Wallet Support</h4>
                <p className="text-sm text-gray-600">
                  Connect with MetaMask, WalletConnect, or Coinbase Wallet
                </p>
              </div>
              <div className="p-4 bg-white border border-gray-200 rounded-lg">
                <h4 className="font-bold mb-2">Send Transactions</h4>
                <p className="text-sm text-gray-600">
                  Send ETH transactions with full status tracking
                </p>
              </div>
              <div className="p-4 bg-white border border-gray-200 rounded-lg">
                <h4 className="font-bold mb-2">Deploy Contracts</h4>
                <p className="text-sm text-gray-600">
                  Deploy smart contracts to Sepolia testnet
                </p>
              </div>
            </div>
          </section>

          {/* Resources */}
          <section className="space-y-4">
            <h3 className="text-2xl font-bold">Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a href="https://wagmi.sh" target="_blank" rel="noopener noreferrer" className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-400 transition-colors">
                <p className="font-bold">Wagmi Documentation →</p>
              </a>
              <a href="https://viem.sh" target="_blank" rel="noopener noreferrer" className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-400 transition-colors">
                <p className="font-bold">Viem Documentation →</p>
              </a>
              <a href="https://www.alchemy.com/faucets/ethereum-sepolia" target="_blank" rel="noopener noreferrer" className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-400 transition-colors">
                <p className="font-bold">Sepolia Faucet →</p>
              </a>
              <a href="https://sepolia.etherscan.io" target="_blank" rel="noopener noreferrer" className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-400 transition-colors">
                <p className="font-bold">Sepolia Etherscan →</p>
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
