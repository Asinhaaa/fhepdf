import { useCallback, useState } from "react";
import { Upload, FileText, X, AlertCircle, CloudUpload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileDropZoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // in bytes
  className?: string;
  disabled?: boolean;
}

export function FileDropZone({
  onFilesSelected,
  accept = ".pdf",
  multiple = true,
  maxFiles = 10,
  maxSize = 50 * 1024 * 1024, // 50MB default
  className,
  disabled = false
}: FileDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFiles = useCallback((files: File[]): File[] => {
    setError(null);
    
    if (!multiple && files.length > 1) {
      setError("Only one file allowed");
      return [files[0]];
    }

    if (files.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return files.slice(0, maxFiles);
    }

    const validFiles: File[] = [];
    for (const file of files) {
      if (file.size > maxSize) {
        setError(`File "${file.name}" exceeds maximum size of ${Math.round(maxSize / 1024 / 1024)}MB`);
        continue;
      }
      
      const acceptedTypes = accept.split(",").map(t => t.trim());
      const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
      const isValidType = acceptedTypes.some(type => {
        if (type.startsWith(".")) {
          return fileExtension === type.toLowerCase();
        }
        return file.type.match(type.replace("*", ".*"));
      });

      if (!isValidType) {
        setError(`File "${file.name}" is not a valid type`);
        continue;
      }

      validFiles.push(file);
    }

    return validFiles;
  }, [accept, maxFiles, maxSize, multiple]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    const validFiles = validateFiles(files);
    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  }, [disabled, onFilesSelected, validateFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = validateFiles(files);
    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
    // Reset input
    e.target.value = "";
  }, [onFilesSelected, validateFiles]);

  return (
    <div className={cn("relative", className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative rounded-3xl border-2 border-dashed p-12 md:p-20 text-center transition-all duration-300 bg-white shadow-sm",
          isDragging 
            ? "border-blue-500 bg-blue-50/50 scale-[1.01]" 
            : "border-slate-200 hover:border-blue-400 hover:bg-slate-50/50",
          disabled && "opacity-50 cursor-not-allowed grayscale",
          !disabled && "cursor-pointer"
        )}
        onClick={() => !disabled && document.getElementById("file-input")?.click()}
      >
        <input
          id="file-input"
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled}
        />
        
        <div className="flex flex-col items-center gap-6">
          <div className={cn(
            "w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-inner",
            isDragging ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600"
          )}>
            <CloudUpload className={cn(
              "w-10 h-10 transition-transform duration-300",
              isDragging && "scale-110"
            )} />
          </div>
          
          <div className="space-y-2">
            <p className="text-2xl font-bold text-slate-900">
              {isDragging ? "Drop files here" : "Choose files or drag here"}
            </p>
            <p className="text-slate-500 font-medium">
              Select PDF files to get started
            </p>
            <p className="text-xs text-slate-400 pt-2">
              Max {Math.round(maxSize / 1024 / 1024)}MB per file
              {multiple && ` • Up to ${maxFiles} files`}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-6 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-3 text-sm text-red-600 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="font-medium">{error}</span>
          <button 
            onClick={() => setError(null)}
            className="ml-auto hover:bg-red-100 rounded-full p-1.5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

interface FileListProps {
  files: File[];
  onRemove: (index: number) => void;
  className?: string;
}

export function FileList({ files, onRemove, className }: FileListProps) {
  if (files.length === 0) return null;

  return (
    <div className={cn("space-y-3", className)}>
      {files.map((file, index) => (
        <div
          key={`${file.name}-${index}`}
          className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-blue-200 transition-colors group"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 text-blue-600">
            <FileText className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-slate-900 truncate">{file.name}</p>
            <p className="text-sm font-medium text-slate-400">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 rounded-full hover:bg-red-50 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onRemove(index)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      ))}
    </div>
  );
}
