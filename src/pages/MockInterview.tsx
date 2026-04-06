import { useState } from 'react';
import Layout from '@/components/Layout';
import FileUpload from '@/components/FileUpload';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Sparkles, Send } from 'lucide-react';
import { toast } from 'sonner';
import type { InterviewQuestion } from '@/types/resume';

export default function MockInterview() {
  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState('');
  const [generating, setGenerating] = useState(false);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [feedback, setFeedback] = useState<Record<number, string>>({});
  const [loadingFeedback, setLoadingFeedback] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!file) return toast.error('Upload a resume');
    if (!jd.trim()) return toast.error('Enter a job description');

    setGenerating(true);
    try {
      const buffer = await file.arrayBuffer();
      const base64 = btoa(new Uint8Array(buffer).reduce((d, b) => d + String.fromCharCode(b), ''));

      const { data, error } = await supabase.functions.invoke('mock-interview', {
        body: {
          fileBase64: base64,
          fileName: file.name,
          fileType: file.type || 'application/pdf',
          jobDescription: jd,
        },
      });

      if (error) throw error;
      setQuestions(data.questions || []);
      setAnswers({});
      setFeedback({});
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate questions');
    } finally {
      setGenerating(false);
    }
  };

  const handleGetFeedback = async (index: number) => {
    const answer = answers[index];
    if (!answer?.trim()) return toast.error('Please write an answer first');

    setLoadingFeedback(index);
    try {
      const { data, error } = await supabase.functions.invoke('mock-interview', {
        body: {
          type: 'feedback',
          question: questions[index].question,
          answer,
          category: questions[index].category,
        },
      });

      if (error) throw error;
      setFeedback(prev => ({ ...prev, [index]: data.feedback }));
    } catch (err: any) {
      toast.error(err.message || 'Failed to get feedback');
    } finally {
      setLoadingFeedback(null);
    }
  };

  const categoryColors: Record<string, string> = {
    technical: 'bg-primary/10 text-primary',
    behavioral: 'bg-accent/10 text-accent-foreground',
    hr: 'bg-info/10 text-info',
  };

  const difficultyColors: Record<string, string> = {
    easy: 'bg-success/10 text-success',
    medium: 'bg-warning/10 text-warning',
    hard: 'bg-destructive/10 text-destructive',
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-primary" /> Mock Interview
          </h1>
          <p className="text-sm text-muted-foreground">AI-generated interview questions based on your resume</p>
        </motion.div>

        {questions.length === 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-border/50">
                <CardHeader><CardTitle className="font-display text-base">Resume</CardTitle></CardHeader>
                <CardContent>
                  <FileUpload onFileSelect={setFile} selectedFile={file} onClear={() => setFile(null)} />
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardHeader><CardTitle className="font-display text-base">Job Description</CardTitle></CardHeader>
                <CardContent>
                  <Textarea placeholder="Paste the job description..." value={jd} onChange={e => setJd(e.target.value)} className="min-h-[186px] resize-none" />
                </CardContent>
              </Card>
            </div>
            <div className="flex justify-center">
              <Button variant="hero" size="lg" onClick={handleGenerate} disabled={generating} className="px-12">
                {generating ? (
                  <><div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" /> Generating...</>
                ) : (
                  <><Sparkles className="w-5 h-5" /> Generate Questions</>
                )}
              </Button>
            </div>
          </>
        )}

        <AnimatePresence>
          {questions.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{questions.length} questions generated</p>
                <Button variant="outline" size="sm" onClick={() => { setQuestions([]); setAnswers({}); setFeedback({}); }}>
                  Start Over
                </Button>
              </div>

              {questions.map((q, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="border-border/50">
                    <CardHeader>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <CardTitle className="font-display text-base">Q{i + 1}</CardTitle>
                        <div className="flex gap-2">
                          <Badge className={categoryColors[q.category]}>{q.category}</Badge>
                          <Badge className={difficultyColors[q.difficulty]}>{q.difficulty}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-foreground font-medium">{q.question}</p>
                      <Textarea
                        placeholder="Type your answer here..."
                        value={answers[i] || ''}
                        onChange={e => setAnswers(prev => ({ ...prev, [i]: e.target.value }))}
                        className="min-h-[80px] resize-none"
                      />
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleGetFeedback(i)} disabled={loadingFeedback === i}>
                          {loadingFeedback === i ? (
                            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <><Send className="w-3 h-3 mr-1" /> Get Feedback</>
                          )}
                        </Button>
                      </div>
                      {feedback[i] && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-lg bg-muted text-sm text-foreground">
                          {feedback[i]}
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
