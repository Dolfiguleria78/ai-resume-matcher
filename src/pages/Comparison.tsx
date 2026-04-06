import { useState } from 'react';
import Layout from '@/components/Layout';
import FileUpload from '@/components/FileUpload';
import ScoreRing from '@/components/ScoreRing';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { GitCompare, Trophy, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import type { AnalysisResult } from '@/types/resume';

export default function Comparison() {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [jd, setJd] = useState('');
  const [comparing, setComparing] = useState(false);
  const [result, setResult] = useState<{ resume1: AnalysisResult; resume2: AnalysisResult; winner: string; summary: string } | null>(null);

  const readFileBase64 = async (file: File) => {
    const buffer = await file.arrayBuffer();
    return btoa(new Uint8Array(buffer).reduce((d, b) => d + String.fromCharCode(b), ''));
  };

  const handleCompare = async () => {
    if (!file1 || !file2) return toast.error('Please upload both resumes');
    if (!jd.trim()) return toast.error('Please enter a job description');

    setComparing(true);
    try {
      const [b1, b2] = await Promise.all([readFileBase64(file1), readFileBase64(file2)]);

      const { data, error } = await supabase.functions.invoke('compare-resumes', {
        body: {
          file1Base64: b1, file1Name: file1.name,
          file2Base64: b2, file2Name: file2.name,
          fileType1: file1.type || 'application/pdf',
          fileType2: file2.type || 'application/pdf',
          jobDescription: jd,
        },
      });

      if (error) throw error;
      setResult(data);
    } catch (err: any) {
      toast.error(err.message || 'Comparison failed');
    } finally {
      setComparing(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <GitCompare className="w-6 h-6 text-primary" /> Resume Comparison
          </h1>
          <p className="text-sm text-muted-foreground">Upload two resumes and compare them against a job description</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-border/50">
            <CardHeader><CardTitle className="font-display text-base">Resume #1</CardTitle></CardHeader>
            <CardContent>
              <FileUpload onFileSelect={setFile1} selectedFile={file1} onClear={() => setFile1(null)} label="Upload Resume 1" />
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardHeader><CardTitle className="font-display text-base">Resume #2</CardTitle></CardHeader>
            <CardContent>
              <FileUpload onFileSelect={setFile2} selectedFile={file2} onClear={() => setFile2(null)} label="Upload Resume 2" />
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/50">
          <CardHeader><CardTitle className="font-display text-base">Job Description</CardTitle></CardHeader>
          <CardContent>
            <Textarea placeholder="Paste the job description..." value={jd} onChange={e => setJd(e.target.value)} className="min-h-[120px] resize-none" />
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button variant="hero" size="lg" onClick={handleCompare} disabled={comparing || !file1 || !file2 || !jd.trim()} className="px-12">
            {comparing ? (
              <><div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" /> Comparing...</>
            ) : (
              <><Sparkles className="w-5 h-5" /> Compare Resumes</>
            )}
          </Button>
        </div>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Winner banner */}
              <Card className="border-primary/30 bg-primary/5">
                <CardContent className="flex items-center justify-center gap-3 py-6">
                  <Trophy className="w-8 h-8 text-primary" />
                  <div className="text-center">
                    <p className="font-display font-bold text-lg text-foreground">
                      {result.winner === 'tie' ? "It's a Tie!" : `${result.winner === 'resume1' ? file1?.name : file2?.name} is the better match`}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">{result.summary}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: file1?.name || 'Resume 1', data: result.resume1, isWinner: result.winner === 'resume1' },
                  { label: file2?.name || 'Resume 2', data: result.resume2, isWinner: result.winner === 'resume2' },
                ].map((r, i) => (
                  <Card key={i} className={`border-border/50 ${r.isWinner ? 'ring-2 ring-primary/30' : ''}`}>
                    <CardHeader>
                      <CardTitle className="font-display text-base flex items-center gap-2">
                        {r.label} {r.isWinner && <Badge className="bg-primary/10 text-primary">Winner</Badge>}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-center"><ScoreRing score={r.data.atsScore} size={100} /></div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1">Skills ({r.data.skills.length})</p>
                        <div className="flex flex-wrap gap-1">
                          {r.data.skills.slice(0, 10).map((s, j) => (
                            <Badge key={j} variant="secondary" className="text-xs">{s}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1">Missing Keywords</p>
                        <div className="flex flex-wrap gap-1">
                          {r.data.missingKeywords.slice(0, 8).map((k, j) => (
                            <Badge key={j} variant="destructive" className="text-xs bg-destructive/10 text-destructive border-destructive/20">{k}</Badge>
                          ))}
                          {r.data.missingKeywords.length === 0 && <span className="text-xs text-muted-foreground">None</span>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
