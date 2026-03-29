import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Upload as UploadIcon, FileText, X, ArrowRight, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import GlassCard from "@/components/GlassCard";

export default function Upload() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [jobDescription, setJobDescription] = useState("");

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && (droppedFile.type === "application/pdf" || droppedFile.name.endsWith(".docx"))) {
      setFile(droppedFile);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };

  const handleAnalyze = () => {
    if (file && jobDescription.trim()) {
      navigate("/processing");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-2">Upload & Analyze</h1>
            <p className="text-muted-foreground">Upload your resume and paste the job description to get started</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Resume Upload */}
            <GlassCard>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-primary" />
                <h2 className="font-semibold">Resume</h2>
              </div>
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  dragActive
                    ? "border-primary bg-primary/5"
                    : file
                    ? "border-success bg-success/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {file ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setFile(null)}>
                      <X className="w-4 h-4 mr-1" /> Remove
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <UploadIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Drop your resume here</p>
                      <p className="text-xs text-muted-foreground">PDF or DOCX, up to 10MB</p>
                    </div>
                    <label>
                      <Button variant="outline" size="sm" asChild>
                        <span className="cursor-pointer">Browse Files</span>
                      </Button>
                      <input
                        type="file"
                        accept=".pdf,.docx"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
            </GlassCard>

            {/* Job Description */}
            <GlassCard>
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-5 h-5 text-primary" />
                <h2 className="font-semibold">Job Description</h2>
              </div>
              <Textarea
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-[200px] resize-none bg-secondary/30 border-border"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {jobDescription.length > 0 ? `${jobDescription.split(/\s+/).filter(Boolean).length} words` : "Paste the full job posting for best results"}
              </p>
            </GlassCard>
          </div>

          <div className="flex justify-center mt-8">
            <Button
              size="lg"
              onClick={handleAnalyze}
              disabled={!file || !jobDescription.trim()}
              className="gradient-primary text-primary-foreground border-0 hover:opacity-90 text-base px-10"
            >
              Analyze Resume <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
