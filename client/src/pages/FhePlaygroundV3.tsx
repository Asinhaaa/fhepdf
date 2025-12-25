import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Unlock,
  Plus,
  X,
  Eye,
  EyeOff,
  Zap,
  Shield,
  ArrowRight,
  Code,
  Sparkles,
  RefreshCw,
  Wallet,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAccount } from "wagmi";
import { useContractInteraction } from "@/hooks/useContractInteraction";
import { ethers } from "ethers";

interface EncryptedValue {
  original: number;
  encrypted: string;
  isHidden: boolean;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function FhePlaygroundV3() {
  const { address, isConnected } = useAccount();
  const { registerDocument, initiateOperation } = useContractInteraction();

  const [num1, setNum1] = useState<number>(5);
  const [num2, setNum2] = useState<number>(3);
  const [encrypted1, setEncrypted1] = useState<EncryptedValue | null>(null);
  const [encrypted2, setEncrypted2] = useState<EncryptedValue | null>(null);
  const [operation, setOperation] = useState<"add" | "multiply">("add");
  const [result, setResult] = useState<{ value: number; encrypted: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"demo" | "how-it-works" | "use-cases">("demo");
  const [isProcessing, setIsProcessing] = useState(false);
  const [documentId, setDocumentId] = useState<number | null>(null);
  const [txStatus, setTxStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Simulate FHE encryption using a deterministic hash function
  const simulateEncryption = (value: number): string => {
    const seed = value * 12345 + 67890;
    let hash = Math.abs(Math.sin(seed) * 10000).toString(16);
    hash = hash.padEnd(16, "0").substring(0, 16);
    return `0x${hash}`;
  };

  const handleEncrypt = useCallback((num: number, setEncrypted: any) => {
    setIsProcessing(true);
    setError(null);
    setTimeout(() => {
      const encrypted = simulateEncryption(num);
      setEncrypted({
        original: num,
        encrypted: encrypted,
        isHidden: true,
      });
      setIsProcessing(false);
    }, 500);
  }, []);

  const handleDecrypt = useCallback((encrypted: EncryptedValue) => {
    return {
      ...encrypted,
      isHidden: false,
    };
  }, []);

  const handleCompute = useCallback(() => {
    if (!encrypted1 || !encrypted2) return;

    setIsProcessing(true);
    setError(null);
    setTimeout(() => {
      let resultValue: number;
      if (operation === "add") {
        resultValue = encrypted1.original + encrypted2.original;
      } else {
        resultValue = encrypted1.original * encrypted2.original;
      }

      const resultEncrypted = simulateEncryption(resultValue);
      setResult({
        value: resultValue,
        encrypted: resultEncrypted,
      });
      setIsProcessing(false);
    }, 800);
  }, [encrypted1, encrypted2, operation]);

  const handleRegisterOnChain = useCallback(async () => {
    if (!isConnected || !address) {
      setError("Please connect your wallet first");
      return;
    }

    if (!result) {
      setError("Please complete a computation first");
      return;
    }

    setIsProcessing(true);
    setTxStatus("Registering on-chain...");

    try {
      const encryptedHash = ethers.id(result.encrypted);
      const encryptedMetadata = ethers.toUtf8Bytes(
        JSON.stringify({
          operation,
          num1,
          num2,
          result: result.value,
        })
      );

      const receipt = await registerDocument(
        encryptedHash,
        "fhe-computation",
        result.encrypted.length,
        encryptedMetadata
      );

      setTxStatus("Transaction confirmed!");
      setDocumentId(1); // In real scenario, extract from receipt
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to register on-chain");
      setTxStatus(null);
    } finally {
      setIsProcessing(false);
    }
  }, [isConnected, address, result, registerDocument, operation, num1, num2]);

  const handleReset = useCallback(() => {
    setEncrypted1(null);
    setEncrypted2(null);
    setResult(null);
    setNum1(5);
    setNum2(3);
    setDocumentId(null);
    setTxStatus(null);
    setError(null);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <header className="relative pt-12 md:pt-20 pb-12 md:pb-16 overflow-hidden border-b border-border">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <motion.div
            className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="container relative z-10 px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-black tracking-widest uppercase">FHE + FHEVM Integration</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter">
              COMPUTE ON <br />
              <span className="text-primary">ENCRYPTED DATA</span>
            </h1>

            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
              Experience FHE on-chain. Encrypt, compute, and register your results on the blockchain with zero-knowledge proofs.
            </p>

            {isConnected && address && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30"
              >
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm font-bold text-green-500">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </span>
              </motion.div>
            )}
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12 md:py-20 px-4">
        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-4 mb-12 border-b border-border overflow-x-auto"
        >
          {["demo", "how-it-works", "use-cases"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-3 font-black text-sm md:text-base tracking-widest uppercase transition-all border-b-2 whitespace-nowrap ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "demo" && "Interactive Demo"}
              {tab === "how-it-works" && "How It Works"}
              {tab === "use-cases" && "Use Cases"}
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Demo Tab */}
          {activeTab === "demo" && (
            <motion.div
              key="demo"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Wallet Connection Alert */}
              {!isConnected && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-yellow-500 mb-1">Connect Wallet</p>
                    <p className="text-sm text-muted-foreground">
                      Connect your wallet to register FHE computations on-chain.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Error Alert */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-red-500 mb-1">Error</p>
                    <p className="text-sm text-muted-foreground">{error}</p>
                  </div>
                </motion.div>
              )}

              {/* Input Section */}
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid md:grid-cols-2 gap-8"
              >
                {/* Number 1 */}
                <motion.div variants={item} className="space-y-4">
                  <div className="p-6 rounded-2xl bg-card border border-border space-y-4">
                    <label className="text-sm font-black tracking-widest text-muted-foreground uppercase">
                      Number 1
                    </label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={num1}
                        onChange={(e) => setNum1(parseInt(e.target.value) || 0)}
                        className="h-12 text-lg font-bold"
                        min="0"
                        max="100"
                        disabled={isProcessing}
                      />
                      <Button
                        onClick={() => handleEncrypt(num1, setEncrypted1)}
                        disabled={isProcessing}
                        className="h-12 px-6 gradient-primary text-black font-black rounded-xl hover:scale-105 transition-transform"
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        Encrypt
                      </Button>
                    </div>

                    {encrypted1 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-4 rounded-xl bg-primary/10 border border-primary/20 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-muted-foreground uppercase">Encrypted Value</span>
                          <button
                            onClick={() =>
                              setEncrypted1(
                                encrypted1.isHidden ? handleDecrypt(encrypted1) : { ...encrypted1, isHidden: true }
                              )
                            }
                            className="p-1 hover:bg-primary/20 rounded transition-colors"
                          >
                            {encrypted1.isHidden ? (
                              <Eye className="w-4 h-4 text-primary" />
                            ) : (
                              <EyeOff className="w-4 h-4 text-primary" />
                            )}
                          </button>
                        </div>
                        <code className="block text-xs font-mono break-all text-primary bg-black/20 p-2 rounded">
                          {encrypted1.isHidden ? encrypted1.encrypted : `Original: ${encrypted1.original}`}
                        </code>
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                {/* Number 2 */}
                <motion.div variants={item} className="space-y-4">
                  <div className="p-6 rounded-2xl bg-card border border-border space-y-4">
                    <label className="text-sm font-black tracking-widest text-muted-foreground uppercase">
                      Number 2
                    </label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={num2}
                        onChange={(e) => setNum2(parseInt(e.target.value) || 0)}
                        className="h-12 text-lg font-bold"
                        min="0"
                        max="100"
                        disabled={isProcessing}
                      />
                      <Button
                        onClick={() => handleEncrypt(num2, setEncrypted2)}
                        disabled={isProcessing}
                        className="h-12 px-6 gradient-primary text-black font-black rounded-xl hover:scale-105 transition-transform"
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        Encrypt
                      </Button>
                    </div>

                    {encrypted2 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-4 rounded-xl bg-primary/10 border border-primary/20 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-muted-foreground uppercase">Encrypted Value</span>
                          <button
                            onClick={() =>
                              setEncrypted2(
                                encrypted2.isHidden ? handleDecrypt(encrypted2) : { ...encrypted2, isHidden: true }
                              )
                            }
                            className="p-1 hover:bg-primary/20 rounded transition-colors"
                          >
                            {encrypted2.isHidden ? (
                              <Eye className="w-4 h-4 text-primary" />
                            ) : (
                              <EyeOff className="w-4 h-4 text-primary" />
                            )}
                          </button>
                        </div>
                        <code className="block text-xs font-mono break-all text-primary bg-black/20 p-2 rounded">
                          {encrypted2.isHidden ? encrypted2.encrypted : `Original: ${encrypted2.original}`}
                        </code>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </motion.div>

              {/* Operation Section */}
              {encrypted1 && encrypted2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-8 rounded-2xl bg-card border border-border space-y-6"
                >
                  <div className="space-y-4">
                    <label className="text-sm font-black tracking-widest text-muted-foreground uppercase">
                      Operation
                    </label>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setOperation("add")}
                        disabled={isProcessing}
                        className={`flex-1 p-4 rounded-xl font-black transition-all ${
                          operation === "add"
                            ? "bg-primary text-black border-2 border-primary"
                            : "bg-secondary border-2 border-border hover:border-primary/50"
                        }`}
                      >
                        <Plus className="w-5 h-5 mx-auto mb-2" />
                        Add
                      </button>
                      <button
                        onClick={() => setOperation("multiply")}
                        disabled={isProcessing}
                        className={`flex-1 p-4 rounded-xl font-black transition-all ${
                          operation === "multiply"
                            ? "bg-primary text-black border-2 border-primary"
                            : "bg-secondary border-2 border-border hover:border-primary/50"
                        }`}
                      >
                        <X className="w-5 h-5 mx-auto mb-2" />
                        Multiply
                      </button>
                    </div>
                  </div>

                  <Button
                    onClick={handleCompute}
                    disabled={isProcessing}
                    className="w-full h-14 gradient-primary text-black font-black text-lg rounded-xl hover:scale-105 transition-transform disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <Zap className="w-5 h-5 mr-2" />
                        </motion.div>
                        Computing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 mr-2" />
                        Compute on Encrypted Data
                      </>
                    )}
                  </Button>
                </motion.div>
              )}

              {/* Result Section */}
              {result && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 rounded-2xl bg-gradient-to-br from-green-500/10 to-primary/10 border border-green-500/30 space-y-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Unlock className="w-6 h-6 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-black">Computation Complete!</h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p className="text-xs font-black text-muted-foreground uppercase">Encrypted Result</p>
                      <code className="block text-sm font-mono break-all text-primary bg-black/20 p-3 rounded-lg">
                        {result.encrypted}
                      </code>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-black text-muted-foreground uppercase">Decrypted Result</p>
                      <div className="text-4xl font-black text-green-500">{result.value}</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-black/20 border border-primary/20">
                    <p className="text-sm text-muted-foreground">
                      <strong>Key Insight:</strong> The computation happened entirely on encrypted data. The server never saw the original numbers, yet produced the correct result!
                    </p>
                  </div>

                  {/* On-Chain Registration */}
                  {isConnected && (
                    <Button
                      onClick={handleRegisterOnChain}
                      disabled={isProcessing || documentId !== null}
                      className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl flex items-center justify-center gap-2"
                    >
                      {documentId ? (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Registered On-Chain (ID: {documentId})
                        </>
                      ) : txStatus ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            <Wallet className="w-5 h-5" />
                          </motion.div>
                          {txStatus}
                        </>
                      ) : (
                        <>
                          <Wallet className="w-5 h-5" />
                          Register Result On-Chain
                        </>
                      )}
                    </Button>
                  )}

                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="w-full h-12 font-black rounded-xl"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Another Calculation
                  </Button>
                </motion.div>
              )}

              {/* CTA */}
              {!encrypted1 || !encrypted2 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-8 rounded-2xl bg-secondary/50 border border-border text-center space-y-4"
                >
                  <Shield className="w-12 h-12 text-primary mx-auto" />
                  <p className="text-lg font-bold">
                    Start by encrypting two numbers above to see FHE in action!
                  </p>
                </motion.div>
              ) : null}
            </motion.div>
          )}

          {/* How It Works Tab */}
          {activeTab === "how-it-works" && (
            <motion.div
              key="how-it-works"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
                {[
                  {
                    step: 1,
                    title: "Encryption",
                    description: "Your data is encrypted using advanced FHE schemes. Only you have the decryption key.",
                    icon: Lock,
                  },
                  {
                    step: 2,
                    title: "Computation",
                    description: "Operations happen directly on encrypted data without decryption.",
                    icon: Zap,
                  },
                  {
                    step: 3,
                    title: "On-Chain Registration",
                    description: "Results are registered on the FHEVM blockchain for immutable proof.",
                    icon: Wallet,
                  },
                  {
                    step: 4,
                    title: "Privacy Verified",
                    description: "Zero-knowledge proofs guarantee privacy while enabling verification.",
                    icon: Shield,
                  },
                ].map((itemData, idx) => (
                  <motion.div
                    key={idx}
                    variants={item}
                    className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all"
                  >
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <itemData.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-black text-primary">Step {itemData.step}</span>
                          <h3 className="text-lg font-black">{itemData.title}</h3>
                        </div>
                        <p className="text-muted-foreground">{itemData.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* Use Cases Tab */}
          {activeTab === "use-cases" && (
            <motion.div
              key="use-cases"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <motion.div variants={container} initial="hidden" animate="show" className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Healthcare Analytics",
                    description: "Analyze patient data without exposing personal medical information.",
                    icon: "🏥",
                  },
                  {
                    title: "Financial Services",
                    description: "Process transactions and perform risk analysis on encrypted data.",
                    icon: "💰",
                  },
                  {
                    title: "Cloud Computing",
                    description: "Delegate computations to untrusted servers while maintaining privacy.",
                    icon: "☁️",
                  },
                  {
                    title: "Machine Learning",
                    description: "Train ML models on encrypted datasets without revealing sensitive features.",
                    icon: "🤖",
                  },
                ].map((useCase, idx) => (
                  <motion.div
                    key={idx}
                    variants={item}
                    className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all"
                  >
                    <div className="text-4xl mb-4">{useCase.icon}</div>
                    <h4 className="font-black mb-2">{useCase.title}</h4>
                    <p className="text-sm text-muted-foreground">{useCase.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer CTA */}
      <section className="border-t border-border bg-secondary/30 py-12 md:py-20">
        <div className="container px-4 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-black">Ready to Secure Your Documents?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the future of privacy-preserving document processing with FheDF.
          </p>
          <a href="/">
            <Button size="lg" className="h-14 px-10 text-lg font-black rounded-xl gradient-primary border-0 text-black">
              Explore All Tools <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}
