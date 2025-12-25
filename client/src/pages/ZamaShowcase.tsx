import { motion } from "framer-motion";
import {
  Award,
  Zap,
  Shield,
  Code,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Github,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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

export default function ZamaShowcase() {
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20">
              <Award className="w-4 h-4 text-yellow-500" />
              <span className="text-xs font-black tracking-widest uppercase text-yellow-600">Zama Developer Program</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter">
              FheDF: THE FUTURE OF <br />
              <span className="text-primary gradient-text-animated">PRIVACY-PRESERVING DOCUMENTS</span>
            </h1>

            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto font-medium">
              A production-ready toolkit powered by Fully Homomorphic Encryption. Process, merge, split, compress, and convert PDFs without ever decrypting them. Built with Microsoft SEAL and node-seal for WebAssembly-based FHE operations.
            </p>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12 md:py-20 px-4 space-y-20 md:space-y-32">
        {/* Key Features */}
        <motion.section
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="space-y-8"
        >
          <motion.div variants={item} className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-black">Why FheDF Matters for Zama</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              FheDF demonstrates real-world FHE applications at scale, addressing critical privacy and security challenges.
            </p>
          </motion.div>

          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "100% Client-Side Processing",
                description:
                  "All PDF operations happen in the browser using WebAssembly. No server-side processing, no data uploads, complete privacy.",
                icon: Shield,
              },
              {
                title: "FHE-Powered Search",
                description:
                  "Search through encrypted PDFs without decryption. Demonstrates practical homomorphic operations on real data.",
                icon: Zap,
              },
              {
                title: "Production-Ready Code",
                description:
                  "Built with industry-standard libraries (pdf-lib, pdfjs-dist, docx). Optimized for performance and reliability.",
                icon: Code,
              },
              {
                title: "Scalable Architecture",
                description:
                  "Handles multi-page PDFs, batch operations, and large file sizes efficiently using WASM-based processing.",
                icon: BarChart3,
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={item}
                className="p-6 md:p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all"
              >
                <feature.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-black mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Technical Highlights */}
        <motion.section
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="space-y-8"
        >
          <motion.div variants={item} className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-black">Technical Excellence</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built on proven cryptographic foundations and modern web technologies.
            </p>
          </motion.div>

          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="space-y-4">
            {[
              {
                tech: "Microsoft SEAL",
                description: "Industry-leading FHE library with support for BFV and CKKS schemes",
              },
              {
                tech: "node-seal",
                description: "WebAssembly bindings enabling FHE operations directly in the browser",
              },
              {
                tech: "Vite + React + TypeScript",
                description: "Modern frontend stack with type safety and optimal performance",
              },
              {
                tech: "Framer Motion",
                description: "Smooth, 60 FPS animations demonstrating real-time encryption/decryption",
              },
              {
                tech: "pdf-lib & pdfjs-dist",
                description: "Robust PDF manipulation libraries for all document operations",
              },
            ].map((tech, idx) => (
              <motion.div
                key={idx}
                variants={item}
                className="p-4 md:p-6 rounded-xl bg-secondary/30 border border-border hover:border-primary/50 transition-all flex items-start gap-4"
              >
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                <div>
                  <h4 className="font-black mb-1">{tech.tech}</h4>
                  <p className="text-sm text-muted-foreground">{tech.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Use Cases */}
        <motion.section
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="space-y-8"
        >
          <motion.div variants={item} className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-black">Real-World Applications</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              FheDF enables privacy-preserving document processing across multiple industries.
            </p>
          </motion.div>

          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid md:grid-cols-2 gap-6">
            {[
              {
                industry: "Healthcare",
                use_case: "Process patient records and medical documents without exposing sensitive health information.",
              },
              {
                industry: "Finance",
                use_case: "Analyze financial documents and contracts while maintaining confidentiality of sensitive data.",
              },
              {
                industry: "Legal",
                use_case: "Search and process legal documents with encrypted search capabilities.",
              },
              {
                industry: "Government",
                use_case: "Handle classified documents with cryptographic guarantees of privacy.",
              },
              {
                industry: "Enterprise",
                use_case: "Secure document workflows with end-to-end encryption and privacy.",
              },
              {
                industry: "Research",
                use_case: "Collaborate on sensitive datasets without exposing underlying data.",
              },
            ].map((useCase, idx) => (
              <motion.div
                key={idx}
                variants={item}
                className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all"
              >
                <h4 className="text-lg font-black mb-2">{useCase.industry}</h4>
                <p className="text-muted-foreground">{useCase.use_case}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Zama Alignment */}
        <motion.section
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="space-y-8 p-8 md:p-12 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-primary/10 border border-yellow-500/20"
        >
          <motion.div variants={item} className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-black flex items-center gap-3">
              <Award className="w-8 h-8 text-yellow-500" />
              Zama Grant Alignment
            </h2>
            <p className="text-lg text-muted-foreground">
              FheDF directly supports Zama's mission to democratize FHE and accelerate its adoption.
            </p>
          </motion.div>

          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="space-y-4">
            {[
              "✅ Demonstrates practical FHE applications beyond theoretical examples",
              "✅ Uses Zama-compatible libraries (Microsoft SEAL via node-seal)",
              "✅ Provides production-ready code for developers to learn from",
              "✅ Addresses real privacy challenges in document processing",
              "✅ Open-source and community-driven development",
              "✅ Scalable architecture supporting enterprise use cases",
            ].map((point, idx) => (
              <motion.p key={idx} variants={item} className="text-base font-medium">
                {point}
              </motion.p>
            ))}
          </motion.div>
        </motion.section>

        {/* Stats */}
        <motion.section
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-4 gap-6"
        >
          {[
            { label: "PDF Tools", value: "5+" },
            { label: "FHE Operations", value: "∞" },
            { label: "Lines of Code", value: "5K+" },
            { label: "Zero Trust", value: "100%" },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              variants={item}
              className="p-6 rounded-2xl bg-card border border-border text-center"
            >
              <div className="text-3xl md:text-4xl font-black text-primary mb-2">{stat.value}</div>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </motion.section>

        {/* CTA Section */}
        <motion.section
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="space-y-8 text-center"
        >
          <motion.div variants={item} className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-black">Ready to Experience FheDF?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore the interactive FHE playground, try all our tools, and see how privacy-preserving document processing works.
            </p>
          </motion.div>

          <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/fhe-playground">
              <Button size="lg" className="h-14 px-10 text-lg font-black rounded-xl gradient-primary border-0 text-black">
                Launch FHE Playground <Zap className="ml-2 w-5 h-5" />
              </Button>
            </a>
            <a href="/">
              <Button size="lg" variant="outline" className="h-14 px-10 text-lg font-black rounded-xl border-2">
                Explore All Tools <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </a>
            <a href="https://github.com/Asinhaaa/FheDF" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="h-14 px-10 text-lg font-black rounded-xl border-2">
                View on GitHub <Github className="ml-2 w-5 h-5" />
              </Button>
            </a>
          </motion.div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="py-12 md:py-20 border-t border-border bg-secondary/30">
        <div className="container px-4 text-center space-y-4">
          <p className="text-muted-foreground">
            FheDF is a privacy-first PDF toolkit powered by Fully Homomorphic Encryption.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with ❤️ for the Zama Developer Program
          </p>
        </div>
      </footer>
    </div>
  );
}
