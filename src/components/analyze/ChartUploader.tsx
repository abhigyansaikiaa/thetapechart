"use client";

import { useState, useCallback } from "react";
import { UploadCloud, Image as ImageIcon, X, Loader2, FileWarning, Target } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import imageCompression from "browser-image-compression";
import { MAX_FILE_SIZE, ACCEPTED_IMAGE_TYPES } from "@/lib/constants";

interface ChartUploaderProps {
  onAnalyze: (file: File, previewUrl: string) => void;
  isAnalyzing: boolean;
}

export function ChartUploader({ onAnalyze, isAnalyzing }: ChartUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const processFile = async (rawFile: File) => {
    setError(null);
    if (!ACCEPTED_IMAGE_TYPES.includes(rawFile.type)) {
      setError("Please upload a valid image (JPEG, PNG, WebP).");
      return;
    }

    let finalFile = rawFile;

    // Compress if over 500KB
    if (rawFile.size > MAX_FILE_SIZE) {
      setIsCompressing(true);
      try {
        const options = {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        finalFile = await imageCompression(rawFile, options);
      } catch (err) {
        setError("Error compressing image. Please try a smaller file.");
        setIsCompressing(false);
        return;
      }
      setIsCompressing(false);
    }

    setFile(finalFile);
    const objectUrl = URL.createObjectURL(finalFile);
    setPreview(objectUrl);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.length > 0) {
      processFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
  });

  const handleClear = () => {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setError(null);
  };

  const handleAnalyzeClick = () => {
    if (file && preview) {
      onAnalyze(file, preview);
    }
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full"
          >
            <div
              className={`relative w-full h-64 rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-6 cursor-pointer transition-colors ${
                isDragActive ? "border-accent bg-accent/5" : "border-border hover:border-accent/50 hover:bg-surface-hover"
              }`}
              {...getRootProps()}
            >
            <input {...getInputProps()} />
            <div className="p-4 rounded-full bg-surface-elevated mb-4">
              <UploadCloud size={32} className="text-accent" />
            </div>
            <h3 className="text-lg font-medium text-white mb-1">Upload Chart Image</h3>
            <p className="text-sm text-foreground-secondary text-center max-w-sm">
              Drag and drop your trading chart here, or click to browse. Max size 500KB (will auto-compress).
            </p>
            {error && (
              <div className="mt-4 flex items-center gap-2 text-negative text-sm bg-negative/10 px-3 py-1.5 rounded-md">
                <FileWarning size={16} />
                {error}
              </div>
            )}
            {isCompressing && (
              <div className="mt-4 flex items-center gap-2 text-accent text-sm">
                <Loader2 size={16} className="animate-spin" />
                Compressing image...
              </div>
            )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full rounded-xl border border-border bg-surface overflow-hidden relative"
          >
            <div className="relative w-full h-64 md:h-80 bg-black/50">
              <img
                src={preview}
                alt="Chart preview"
                className="w-full h-full object-contain"
              />
              {!isAnalyzing && (
                <button
                  onClick={handleClear}
                  className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-negative/80 text-white rounded-full backdrop-blur-md transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>
            <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface-elevated border-t border-border">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <ImageIcon size={20} className="text-foreground-muted" />
                <div className="text-sm truncate max-w-[200px]">
                  <p className="text-white font-medium truncate">{file?.name}</p>
                  <p className="text-foreground-muted">{(file?.size! / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <button
                onClick={handleAnalyzeClick}
                disabled={isAnalyzing}
                className="w-full sm:w-auto px-6 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-md font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent/20"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Analyzing with Claude...
                  </>
                ) : (
                  <>
                    <Target size={18} />
                    Analyze Chart
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
