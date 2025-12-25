import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  Merge, 
  Scissors, 
  Minimize2, 
  RefreshCw, 
  Search, 
  ShieldCheck, 
  Lock,
  ArrowRight,
  Zap,
  Shield,
  Key,
  Twitter,
  Github,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";

const tools = [
  {
    id: "merge",
    title: "Merge PDF",
    description: "Combine multiple PDF files into one document.",
    icon: <Merge className="w-6 h-6" />,
    href: "/tools/merge",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    id: "split",
    title: "Split PDF",
    description: "Extract pages or split into separate files.",
    icon: <Scissors className="w-6 h-6" />,
    href: "/tools/split",
    color: "bg-green-500/10 text-green-500",
  },
  {
    id: "compress",
    title: "Compress PDF",
    description: "Reduce file size while keeping quality.",
    icon: <Minimize2 className="w-6 h-6" />,
    href: "/tools/compress",
    color: "bg-orange-500/10 text-orange-500",
  },
  {
    id: "convert",
    title: "PDF to Image",
    description: "Convert PDF pages to PNG or JPEG images.",
    icon: <RefreshCw className="w-6 h-6" />,
    href: "/tools/convert",
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    id: "search",
    title: "Encrypted Search",
    description: "Search inside PDFs using FHE privacy.",
    icon: <Search className="w-6 h-6" />,
    href: "/tools/search",
    color: "bg-primary/10 text-primary",
    isFhe: true,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-black">
      {/* Hero Section */}
      <header className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-primary/5 blur-[100px] rounded-full" />
        </div>

        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black tracking-[0.2em] mb-8"
          >
            <ShieldCheck className="w-4 h-4" />
            100% CLIENT-SIDE PRIVACY
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-[0.9]"
          >
            SECURE YOUR <br />
            <span className="text-primary">DOCUMENTS.</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-medium"
          >
            The world's first PDF toolkit powered by Fully Homomorphic Encryption. 
            Process, merge, and search your files without ever decrypting them.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Button 
              size="lg" 
              onClick={() => {
                const element = document.getElementById('tools-section');
                if (element) {
                  const offset = 80;
                  const bodyRect = document.body.getBoundingClientRect().top;
                  const elementRect = element.getBoundingClientRect().top;
                  const elementPosition = elementRect - bodyRect;
                  const offsetPosition = elementPosition - offset;
                  window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
              }}
              className="h-14 px-8 text-lg font-black rounded-xl gradient-primary border-0 text-black hover:scale-105 transition-transform"
            >
              Get Started <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <a href="https://github.com/Asinhaaa/FheDF" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-black rounded-xl border-2 border-white/10 hover:bg-white/5 transition-colors">
                View on GitHub
              </Button>
            </a>
          </motion.div>
        </div>
      </header>

      {/* Tools Grid */}
      <section id="tools-section" className="container py-20">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-black tracking-tight">POWERFUL TOOLS</h2>
          <div className="h-px flex-1 bg-border mx-8 hidden md:block" />
          <p className="text-sm font-bold text-muted-foreground tracking-widest uppercase">5 TOOLS AVAILABLE</p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {tools.map((tool) => (
            <motion.div key={tool.id} variants={item}>
              <Link href={tool.href}>
                <div className="group relative h-full p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 cursor-pointer overflow-hidden">
                  {/* Hover Background */}
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative z-10">
                    <div className={`w-14 h-14 rounded-xl ${tool.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      {tool.icon}
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="text-2xl font-black tracking-tight">{tool.title}</h3>
                      {tool.isFhe && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded bg-primary text-black text-[10px] font-black tracking-tighter">
                          <Lock className="w-3 h-3" /> FHE
                        </div>
                      )}
                    </div>
                    
                    <p className="text-muted-foreground font-medium mb-8">
                      {tool.description}
                    </p>
                    
                    <div className="flex items-center text-sm font-black tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                      OPEN TOOL <ArrowRight className="ml-2 w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="bg-secondary/30 py-32 border-y border-border">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-3xl font-black tracking-tight">LIGHTNING FAST</h3>
              <p className="text-lg text-muted-foreground font-medium">
                Optimized WASM-based processing ensures your files are handled in milliseconds, right in your browser.
              </p>
            </div>
            <div className="space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-3xl font-black tracking-tight">ZERO TRUST</h3>
              <p className="text-lg text-muted-foreground font-medium">
                We never see your data. No uploads, no servers, no logs. Your privacy is mathematically guaranteed.
              </p>
            </div>
            <div className="space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Key className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-3xl font-black tracking-tight">FHE POWERED</h3>
              <p className="text-lg text-muted-foreground font-medium">
                Search through encrypted documents without ever revealing the content or your search query.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-border">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
              <span className="font-black text-black text-xs">FHE</span>
            </div>
            <span className="font-black tracking-tighter text-2xl">FheDF</span>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="flex gap-6">
              <a href="https://twitter.com/ramx_ai" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://github.com/Asinhaaa" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
            <div className="text-right">
              <p className="text-sm font-black tracking-widest uppercase">
                Made by <a href="https://twitter.com/ramx_ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@ramx_ai</a>
              </p>
              <p className="text-xs text-muted-foreground font-medium">
                © 2025 FheDF. Built for the private web.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
