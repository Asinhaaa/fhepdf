import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Lock, 
  FileText, 
  Merge, 
  Scissors, 
  Minimize2, 
  RefreshCw, 
  Search, 
  Github,
  ArrowRight,
  Sparkles,
  Coffee,
  ChevronRight
} from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

const tools = [
  {
    title: "Merge PDF",
    description: "Combine multiple PDF files into one",
    icon: Merge,
    href: "/tools/merge",
    category: "ORGANIZE",
    iconBg: "bg-blue-500"
  },
  {
    title: "Split PDF",
    description: "Extract pages or split into multiple files",
    icon: Scissors,
    href: "/tools/split",
    category: "ORGANIZE",
    iconBg: "bg-purple-500"
  },
  {
    title: "Compress PDF",
    description: "Reduce PDF file size",
    icon: Minimize2,
    href: "/tools/compress",
    category: "OPTIMIZE",
    iconBg: "bg-orange-500"
  },
  {
    title: "FHE Search",
    description: "Privacy-preserving encrypted search",
    icon: Search,
    href: "/tools/encrypted-search",
    category: "PRIVACY",
    iconBg: "bg-blue-600",
    featured: true
  },
  {
    title: "PDF to Images",
    description: "Convert PDF pages to JPG or PNG",
    icon: RefreshCw,
    href: "/tools/convert",
    category: "CONVERT",
    iconBg: "bg-emerald-500"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8faff]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">FHE<span className="text-blue-600">Pdf</span></span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm font-medium text-blue-600">All Tools</Link>
              <Link href="/tools/merge" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Merge</Link>
              <Link href="/tools/split" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Split</Link>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="hidden sm:flex gap-2 border-slate-200 text-slate-600 hover:bg-slate-50">
              <Coffee className="w-4 h-4 text-amber-500" />
              Buy me a coffee
            </Button>
            <Link href="/tools/encrypted-search">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
              All PDF Tools
            </h1>
            <p className="text-slate-500 text-xl max-w-2xl mx-auto leading-relaxed mb-10">
              Everything you need to manage your PDF files in one place. 100% private, browser-based processing powered by FHE.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="pb-32">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {tools.map((tool, index) => (
              <Link key={tool.title} href={tool.href}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="group"
                >
                  <Card className="h-full border-none shadow-sm hover:shadow-xl hover:shadow-blue-100 transition-all duration-300 rounded-[2rem] overflow-hidden bg-white cursor-pointer border border-transparent hover:border-blue-100">
                    <CardContent className="p-8">
                      <div className="flex justify-between items-start mb-6">
                        <div className={`w-14 h-14 rounded-2xl ${tool.iconBg} flex items-center justify-center shadow-lg shadow-blue-100`}>
                          <tool.icon className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                          {tool.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                        {tool.title}
                        {tool.featured && (
                          <Badge className="bg-blue-100 text-blue-600 border-none text-[10px] font-bold px-2 py-0">
                            FHE
                          </Badge>
                        )}
                      </h3>
                      <p className="text-slate-500 font-medium mb-6 leading-relaxed">
                        {tool.description}
                      </p>
                      <div className="flex items-center text-blue-600 font-bold text-sm group-hover:translate-x-1 transition-transform">
                        Open Tool <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="bg-blue-50 text-blue-600 border-none font-bold mb-4">
                PRIVACY FIRST
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Why Choose FHEPdf?</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="flex gap-5">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 text-blue-600">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2 text-lg">100% Client-Side</h4>
                  <p className="text-slate-500 font-medium leading-relaxed">
                    Your files never leave your device. All processing happens locally in your browser using WebAssembly.
                  </p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 text-blue-600">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2 text-lg">FHE Powered</h4>
                  <p className="text-slate-500 font-medium leading-relaxed">
                    Search through encrypted data without ever decrypting it. True privacy-preserving computation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 bg-white">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight text-slate-900">FHE<span className="text-blue-600">Pdf</span></span>
            </div>
            <div className="flex items-center gap-8 text-sm font-medium text-slate-500">
              <Link href="/" className="hover:text-blue-600 transition-colors">All Tools</Link>
              <Link href="/documentation" className="hover:text-blue-600 transition-colors">Documentation</Link>
              <a href="https://github.com/asinhaaa" className="hover:text-blue-600 transition-colors">GitHub</a>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Shield className="w-4 h-4" />
              <span>100% private, browser-based processing</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
