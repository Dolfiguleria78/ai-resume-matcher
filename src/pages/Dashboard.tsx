import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import FileUpload from '@/components/FileUpload';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Sparkles, History, FileText, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import JobRecommendations from '@/components/JobRecommendations';
import type { AnalysisResult } from '@/types/resume';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!file) return toast.error('Please upload a resume');
    if (!jobDescription.trim()) return toast.error('Please enter a job description');

    setAnalyzing(true);
    try {
      // Read file as base64
      const buffer = await file.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );

      const { data, error } = await supabase.functions.invoke('analyze-resume', {
        body: {
          fileBase64: base64,
          fileName: file.name,
          fileType: file.type || (file.name.endsWith('.docx') ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'application/pdf'),
          jobDescription,
        },
      });

      if (error) throw error;

      setLastAnalysis(data);
      navigate('/results', { state: { analysis: data, fileName: file.name } });
    } catch (err: any) {
      console.error('Analysis error:', err);
      toast.error(err.message || 'Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const stats = [
    { icon: FileText, label: 'Resumes Analyzed', value: '—', color: 'text-primary' },
    { icon: TrendingUp, label: 'Avg ATS Score', value: '—', color: 'text-success' },
    { icon: History, label: 'Recent Activity', value: 'Start now', color: 'text-info' },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Welcome{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}
          </h1>
          <p className="text-muted-foreground mt-1">Upload your resume and job description to get started.</p>
        </motion.div>

        {/* Quick stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {stats.map((stat, i) => (
            <Card key={i} className="gradient-card border-border/50">
              <CardContent className="flex items-center gap-3 pt-5">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="font-display font-semibold text-foreground">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Upload & JD section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="font-display text-lg">Resume</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload
                onFileSelect={setFile}
                selectedFile={file}
                onClear={() => setFile(null)}
              />
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="font-display text-lg">Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                className="min-h-[186px] resize-none"
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center"
        >
          <Button
            variant="hero"
            size="lg"
            onClick={handleAnalyze}
            disabled={analyzing || !file || !jobDescription.trim()}
            className="px-12"
          >
            {analyzing ? (
              <>
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Analyze Resume
              </>
            )}
          </Button>
        </motion.div>

        {/* Job Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <JobRecommendations analysis={lastAnalysis} />
        </motion.div>
      </div>
    </Layout>
  );
}
