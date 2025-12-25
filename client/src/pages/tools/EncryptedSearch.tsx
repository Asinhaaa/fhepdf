import { useState, useCallback, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { FileDropZone } from "@/components/FileDropZone";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Loader2, 
  FileText,
  Lock,
  Shield,
  CheckCircle2,
  Key,
  AlertCircle,
  Binary,
  Cpu,
  RefreshCcw
} from "lucide-react";
import { extractTextFromPdf, getPdfPageCount } from "@/lib/pdfUtils";
import { toast } from "sonner";
import * as fheService from "@/lib/fheService";
import { setEncryptedTokens, getEncryptedTokens } from "@/lib/keyStorage";
import { motion, AnimatePresence } from "framer-motion";

interface SearchResult {
  batchIndex: number;
  matchCount: number;
}

export default function EncryptedSearch() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isInitializing, setIsInitializing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [textContent, setTextContent] = useState<string[]>([]);
  const [encryptedBatches, setEncryptedBatches] = useState<string[]>([]);
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [fheReady, setFheReady] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  // Initialize FHE on component mount
  useEffect(() => {
    const init = async () => {
      setIsInitializing(true);
      try {
        await fheService.initializeFHE();
        setFheReady(true);
      } catch (error) {
        console.error("FHE initialization error:", error);
        setInitError(error instanceof Error ? error.message : "Unknown error");
        toast.error("Failed to initialize encryption engine.");
      } finally {
        setIsInitializing(false);
      }
    };

    init();

    return () => {
      fheService.cleanup();
    };
  }, []);

  const handleFileSelected = useCallback(async (files: File[]) => {
    if (!fheReady) {
      toast.error("Encryption engine is still warming up...");
      return;
    }

    const selectedFile = files[0];
    setFile(selectedFile);
    setResults(null);
    setTextContent([]);
    setEncryptedBatches([]);
    
    try {
      const count = await getPdfPageCount(selectedFile);
      setPageCount(count);
      
      setIsProcessing(true);
      setProgress(0);
      
      // Step 1: Extract Text
      const text = await extractTextFromPdf(selectedFile, (p) => setProgress(p * 0.4));
      setTextContent(text);

      // Step 2: FHE Processing
      const documentId = `${selectedFile.name}-${selectedFile.size}`;
      const cached = await getEncryptedTokens(documentId);

      if (cached) {
        setEncryptedBatches(cached.encryptedBatches);
        setProgress(100);
        toast.success("Document loaded from secure cache");
      } else {
        const encrypted = await fheService.encryptDocument(text, (p) => setProgress(40 + p * 0.6));
        setEncryptedBatches(encrypted);
        await setEncryptedTokens(documentId, encrypted);
        toast.success("Document successfully encrypted with FHE");
      }

      setIsProcessing(false);
    } catch (error) {
      console.error("Processing error:", error);
      toast.error("Failed to process document.");
      setIsProcessing(false);
    }
  }, [fheReady]);

  const handleSearch = async () => {
    if (!searchQuery.trim() || encryptedBatches.length === 0) {
      toast.error("Please enter a search term");
      return;
    }

    setIsSearching(true);
    setResults(null);
    setProgress(0);

    try {
      const searchResults = await fheService.searchEncrypted(
        encryptedBatches,
        searchQuery,
        setProgress
      );

      setResults(searchResults);

      if (searchResults.length > 0) {
        const totalMatches = searchResults.reduce((sum, r) => sum + r.matchCount, 0);
        toast.success(`Found ${totalMatches} matches in encrypted data`);
      } else {
        toast.info("No matches found in encrypted data");
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Encrypted search failed.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPageCount(0);
    setTextContent([]);
    setEncryptedBatches([]);
    setResults(null);
    setSearchQuery("");
    setProgress(0);
  };

  return (
    <ToolLayout
      title="Encrypted Search"
      description="Search through your PDF documents with absolute privacy using Fully Homomorphic Encryption."
      badge="FHE POWERED"
    >
      <div className="space-y-8">
        {/* Status Section */}
        <AnimatePresence mode="wait">
          {isInitializing ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-blue-50 border border-blue-100 rounded-3xl p-6 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Initializing FHE Engine</h3>
                <p className="text-sm text-slate-500 font-medium">Setting up Microsoft SEAL WebAssembly environment...</p>
              </div>
            </motion.div>
          ) : initError ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-100 rounded-3xl p-6 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-200">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Initialization Failed</h3>
                <p className="text-sm text-slate-500 font-medium">{initError}. Please refresh the page.</p>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Main Tool Area */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
          <div className="p-8 md:p-12">
            {!file && (
              <FileDropZone
                onFilesSelected={handleFileSelected}
                accept=".pdf"
                multiple={false}
                disabled={isProcessing || !fheReady}
              />
            )}

            {isProcessing && (
              <div className="py-12 text-center space-y-6">
                <div className="relative w-24 h-24 mx-auto">
                  <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
                  <div 
                    className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" 
                    style={{ animationDuration: '1.5s' }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lock className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900">
                    {progress < 40 ? "Extracting Content" : "Encrypting with FHE"}
                  </h3>
                  <p className="text-slate-500 font-medium">
                    {progress < 40 ? "Reading PDF structure..." : "Performing homomorphic encoding..."}
                  </p>
                </div>
                <div className="max-w-xs mx-auto">
                  <Progress value={progress} className="h-2 bg-slate-100" />
                  <p className="text-xs font-bold text-slate-400 mt-3 tracking-widest uppercase">
                    {Math.round(progress)}% SECURED
                  </p>
                </div>
              </div>
            )}

            {file && encryptedBatches.length > 0 && !isProcessing && (
              <div className="space-y-8">
                {/* File Info Card */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-3xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm text-blue-600">
                      <FileText className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-lg truncate max-w-[200px] md:max-w-md">{file.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">{pageCount} Pages</span>
                        <div className="w-1 h-1 rounded-full bg-slate-300" />
                        <Badge variant="outline" className="border-green-200 bg-green-50 text-green-600 font-bold text-[10px] px-2 py-0">
                          FHE ENCRYPTED
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    onClick={handleReset}
                    className="rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 font-bold"
                  >
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Change File
                  </Button>
                </div>

                {/* Search Input */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                    <Search className="w-6 h-6 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Search anything privately..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    disabled={isSearching}
                    className="h-16 pl-14 pr-36 rounded-2xl border-2 border-slate-100 focus:border-blue-600 focus:ring-0 text-lg font-medium transition-all shadow-sm"
                  />
                  <div className="absolute inset-y-2 right-2">
                    <Button 
                      onClick={handleSearch} 
                      disabled={isSearching || !searchQuery.trim()}
                      className="h-full px-8 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 font-bold text-base transition-all active:scale-95"
                    >
                      {isSearching ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        "Search"
                      )}
                    </Button>
                  </div>
                </div>

                {/* Search Progress */}
                {isSearching && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
                    <div className="flex items-center justify-between text-sm font-bold text-slate-400 uppercase tracking-widest">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-blue-600" />
                        <span>Homomorphic Computing</span>
                      </div>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2 bg-slate-100" />
                  </div>
                )}

                {/* Results Section */}
                <AnimatePresence>
                  {results && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-slate-900">Search Results</h3>
                        <Badge className="bg-blue-600 font-bold">
                          {results.reduce((sum, r) => sum + r.matchCount, 0)} Matches
                        </Badge>
                      </div>

                      {results.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {results.map((result) => (
                            <div
                              key={result.batchIndex}
                              className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm hover:border-blue-200 transition-all group"
                            >
                              <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                  <Binary className="w-5 h-5" />
                                </div>
                                <Badge variant="secondary" className="bg-green-50 text-green-600 border-none font-bold">
                                  MATCH FOUND
                                </Badge>
                              </div>
                              <p className="font-bold text-slate-900">Encrypted Batch {result.batchIndex + 1}</p>
                              <p className="text-sm font-medium text-slate-400 mt-1">
                                {result.matchCount} occurrences detected homomorphically
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-12 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <Search className="w-8 h-8 text-slate-300" />
                          </div>
                          <p className="text-lg font-bold text-slate-900">No matches found</p>
                          <p className="text-slate-500 font-medium">Try a different search term</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Privacy Footer */}
          <div className="bg-slate-50 border-t border-slate-100 p-6 flex flex-col md:flex-row items-center justify-center gap-6 text-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-blue-600">
                <Shield className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-900">100% Private</p>
                <p className="text-xs font-medium text-slate-500">Processing happens entirely in your browser</p>
              </div>
            </div>
            <div className="hidden md:block w-px h-8 bg-slate-200" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-blue-600">
                <Lock className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-900">FHE Powered</p>
                <p className="text-xs font-medium text-slate-500">Powered by Microsoft SEAL WebAssembly</p>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Explanation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="rounded-[2rem] border-none shadow-lg shadow-slate-200/50 bg-white">
            <CardContent className="pt-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6">
                <Key className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Local Key Gen</h4>
              <p className="text-sm font-medium text-slate-500 leading-relaxed">
                Encryption keys are generated locally and never leave your device.
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-[2rem] border-none shadow-lg shadow-slate-200/50 bg-white">
            <CardContent className="pt-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6">
                <Binary className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Encrypted Search</h4>
              <p className="text-sm font-medium text-slate-500 leading-relaxed">
                Search queries are encrypted before being compared with document data.
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-[2rem] border-none shadow-lg shadow-slate-200/50 bg-white">
            <CardContent className="pt-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Zero Knowledge</h4>
              <p className="text-sm font-medium text-slate-500 leading-relaxed">
                Neither the server nor any third party can see your data or queries.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
