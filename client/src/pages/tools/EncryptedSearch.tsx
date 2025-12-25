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
} from "lucide-react";
import { extractTextFromPdf, getPdfPageCount } from "@/lib/pdfUtils";
import { toast } from "sonner";
import * as fheService from "@/lib/fheService";
import { setEncryptedTokens, getEncryptedTokens } from "@/lib/keyStorage";

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
        toast.success("FHE encryption ready!");
      } catch (error) {
        console.error("FHE initialization error:", error);
        setInitError(error instanceof Error ? error.message : "Unknown error");
        toast.error("Failed to initialize encryption. Please refresh the page.");
      } finally {
        setIsInitializing(false);
      }
    };

    init();

    // Cleanup on unmount
    return () => {
      fheService.cleanup();
    };
  }, []);

  const handleFileSelected = useCallback(async (files: File[]) => {
    if (!fheReady) {
      toast.error("Encryption not ready yet. Please wait.");
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
      
      // Extract text
      setIsProcessing(true);
      setProgress(0);
      const text = await extractTextFromPdf(selectedFile, (p) => setProgress(p * 0.5));
      setTextContent(text);

      // Check if we have cached encrypted tokens
      const documentId = `${selectedFile.name}-${selectedFile.size}`;
      const cached = await getEncryptedTokens(documentId);

      if (cached) {
        console.log("Using cached encrypted tokens");
        setEncryptedBatches(cached.encryptedBatches);
        setProgress(100);
        toast.success("PDF loaded from cache and ready for search!");
      } else {
        // Encrypt the document
        console.log("Encrypting document...");
        toast.info("Encrypting document with FHE...");
        const encrypted = await fheService.encryptDocument(text, (p) => setProgress(50 + p * 0.5));
        setEncryptedBatches(encrypted);

        // Cache the encrypted tokens
        await setEncryptedTokens(documentId, encrypted);
        toast.success("PDF encrypted and ready for search!");
      }

      setIsProcessing(false);
    } catch (error) {
      console.error("Processing error:", error);
      toast.error("Failed to process PDF. Please try another file.");
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
      toast.info("Performing homomorphic search...");
      const searchResults = await fheService.searchEncrypted(
        encryptedBatches,
        searchQuery,
        setProgress
      );

      setResults(searchResults);

      if (searchResults.length > 0) {
        const totalMatches = searchResults.reduce((sum, r) => sum + r.matchCount, 0);
        toast.success(`Found ${totalMatches} matches in ${searchResults.length} batch(es)`);
      } else {
        toast.info("No matches found");
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Search failed. Please try again.");
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
      title="FHE Encrypted Search"
      description="Search your PDF without revealing the query or content"
      icon={<Search className="w-8 h-8 text-white" />}
      iconColor="from-cyan-500 to-blue-600"
      badge="FHE"
    >
      <div className="space-y-6">
        {/* FHE Status Banner */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                {isInitializing ? (
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                ) : fheReady ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                ) : initError ? (
                  <AlertCircle className="w-6 h-6 text-red-500" />
                ) : (
                  <Shield className="w-6 h-6 text-primary" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">
                  {isInitializing 
                    ? "Initializing Encryption..." 
                    : initError 
                    ? "Encryption Error" 
                    : "Fully Homomorphic Encryption"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isInitializing
                    ? "Setting up encryption keys and parameters using Microsoft SEAL..."
                    : initError
                    ? `Error: ${initError}. Please refresh the page.`
                    : "Your search query is encrypted before processing. The search is performed on encrypted data using node-seal (Microsoft SEAL), and results are decrypted only on your device. Neither the query nor the document content is ever exposed."}
                </p>
                {fheReady && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="secondary" className="bg-primary/10">
                      <Lock className="w-3 h-3 mr-1" />
                      Encrypted Query
                    </Badge>
                    <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                      <Key className="w-3 h-3 mr-1" />
                      Keys Loaded
                    </Badge>
                    <Badge variant="secondary" className="bg-blue-500/10 text-blue-500">
                      <Shield className="w-3 h-3 mr-1" />
                      Microsoft SEAL
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* File Drop Zone */}
        {!file && (
          <FileDropZone
            onFilesSelected={handleFileSelected}
            accept=".pdf"
            multiple={false}
            disabled={isProcessing || !fheReady}
          />
        )}

        {/* Processing Progress */}
        {isProcessing && (
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-4">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <span className="font-medium">
                  {progress < 50 ? "Extracting text from PDF..." : "Encrypting document with FHE..."}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">
                {Math.round(progress)}% complete
              </p>
            </CardContent>
          </Card>
        )}

        {/* Search Interface */}
        {file && encryptedBatches.length > 0 && !isProcessing && (
          <>
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <FileText className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {pageCount} pages • {encryptedBatches.length} encrypted batches • Ready for search
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter search query..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    disabled={isSearching}
                    className="flex-1"
                  />
                  <Button onClick={handleSearch} disabled={isSearching}>
                    {isSearching ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Search
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={handleReset}>
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Search Progress */}
            {isSearching && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    <span className="font-medium">Performing homomorphic search on encrypted data...</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-2">
                    Processing batch {Math.ceil((progress / 100) * encryptedBatches.length)} of {encryptedBatches.length}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Results */}
            {results && results.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    Search Results
                  </h3>
                  <div className="space-y-2">
                    {results.map((result) => (
                      <div
                        key={result.batchIndex}
                        className="p-4 bg-accent/10 rounded-lg border border-accent/20 hover:bg-accent/20 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">
                              Batch {result.batchIndex + 1}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {result.matchCount} match{result.matchCount > 1 ? "es" : ""} found
                            </p>
                          </div>
                          <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Match
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      <strong>Note:</strong> Results show encrypted batch indices. Each batch contains up to 4,096 tokens. 
                      The search was performed entirely on encrypted data using homomorphic operations.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {results && results.length === 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">No matches found</p>
                    <p className="text-sm text-muted-foreground">
                      No matches found for "{searchQuery}" in the encrypted document.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Technical Info */}
        <Card className="bg-secondary/50 border-secondary">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              How It Works
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">1. Key Generation:</strong> On first use, encryption keys are generated and stored securely in your browser's IndexedDB.
              </p>
              <p>
                <strong className="text-foreground">2. Document Encryption:</strong> Your PDF is tokenized and encrypted using the BFV scheme (Brakerski-Fan-Vercauteren) with 128-bit security.
              </p>
              <p>
                <strong className="text-foreground">3. Query Encryption:</strong> Your search query is encrypted with the same keys before being processed.
              </p>
              <p>
                <strong className="text-foreground">4. Homomorphic Search:</strong> The search is performed on encrypted data using homomorphic subtraction to find matches without decryption.
              </p>
              <p>
                <strong className="text-foreground">5. Result Decryption:</strong> Only the final results are decrypted on your device. The search process never exposes plaintext data.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
