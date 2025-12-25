import { ReactNode } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, Shield, Github, Coffee } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolLayoutProps {
  title: string;
  description: string;
  icon: ReactNode;
  iconColor?: string;
  badge?: string;
  children: ReactNode;
  className?: string;
}

export function ToolLayout({
  title,
  description,
  icon,
  iconColor = "from-blue-500 to-blue-600",
  badge,
  children,
  className
}: ToolLayoutProps) {
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
              <Link href="/" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">All Tools</Link>
              <Link href="/tools/merge" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Merge</Link>
              <Link href="/tools/split" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Split</Link>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="hidden sm:flex gap-2 border-slate-200 text-slate-600 hover:bg-slate-50">
              <Coffee className="w-4 h-4 text-amber-500" />
              Buy me a coffee
            </Button>
            <a 
              href="https://github.com/asinhaaa" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-900 transition-colors"
            >
              <Github className="w-6 h-6" />
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-24">
        <div className="container">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">{title}</h1>
              {badge && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-none px-3 py-1 font-semibold">
                  {badge}
                </Badge>
              )}
            </div>
            <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">{description}</p>
          </div>

          {/* Tool Content */}
          <div className={cn("max-w-4xl mx-auto", className)}>
            {children}
          </div>
        </div>
      </main>

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
