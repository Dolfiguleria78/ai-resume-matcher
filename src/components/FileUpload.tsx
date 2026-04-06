import { useCallback, useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  label?: string;
  selectedFile?: File | null;
  onClear?: () => void;
}

export default function FileUpload({
  onFileSelect,
  accept = '.pdf,.docx',
  label = 'Upload Resume',
  selectedFile,
  onClear,
}: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
        dragOver
          ? 'border-primary bg-primary/5'
          : selectedFile
          ? 'border-success/50 bg-success/5'
          : 'border-border hover:border-primary/50 hover:bg-muted/50'
      }`}
    >
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <AnimatePresence mode="wait">
        {selectedFile ? (
          <motion.div
            key="file"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center gap-2"
          >
            <FileText className="w-10 h-10 text-success" />
            <p className="font-medium text-foreground">{selectedFile.name}</p>
            <p className="text-xs text-muted-foreground">
              {(selectedFile.size / 1024).toFixed(1)} KB
            </p>
            {onClear && (
              <button
                onClick={(e) => { e.stopPropagation(); onClear(); }}
                className="mt-1 p-1 rounded-full hover:bg-destructive/10 text-destructive transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center gap-2"
          >
            <Upload className="w-10 h-10 text-muted-foreground" />
            <p className="font-medium text-foreground">{label}</p>
            <p className="text-xs text-muted-foreground">
              Drag & drop or click to browse (PDF, DOCX)
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
