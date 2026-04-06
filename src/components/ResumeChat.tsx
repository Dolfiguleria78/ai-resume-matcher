import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Bot, User, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { AnalysisResult } from '@/types/resume';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ResumeChatProps {
  analysis: AnalysisResult;
}

const SUGGESTIONS = [
  "What skills am I missing?",
  "How can I increase my ATS score?",
  "Improve my experience section",
  "What are my strengths?",
];

export default function ResumeChat({ analysis }: ResumeChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const resumeText = `Name: ${analysis.candidate.name}
Email: ${analysis.candidate.email}
Skills: ${analysis.skills.join(', ')}
Experience: ${analysis.experience.join('; ')}
Education: ${analysis.education.join('; ')}
ATS Score: ${analysis.atsScore}%
Matched Keywords: ${analysis.matchedKeywords.join(', ')}
Missing Keywords: ${analysis.missingKeywords.join(', ')}
Skill Gaps: ${analysis.skillGaps.join(', ')}
Improvements: ${analysis.improvements.join('; ')}`;

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('resume-chat', {
        body: {
          resumeText,
          question: text.trim(),
          history: messages,
        },
      });

      if (error) throw error;
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
    } catch (err: any) {
      toast.error(err.message || 'Failed to get response');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="font-display flex items-center gap-2 text-base">
          <MessageSquare className="w-5 h-5 text-primary" /> AI Resume Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Messages */}
        <div ref={scrollRef} className="h-72 overflow-y-auto space-y-3 pr-1">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground text-sm py-8 space-y-3">
              <Bot className="w-8 h-8 mx-auto opacity-50" />
              <p>Ask me anything about your resume!</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {SUGGESTIONS.map((s, i) => (
                  <Button key={i} variant="outline" size="sm" className="text-xs" onClick={() => sendMessage(s)}>
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-3.5 h-3.5 text-primary" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}>
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0 mt-1">
                    <User className="w-3.5 h-3.5 text-primary-foreground" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <div className="flex gap-2 items-center">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5 text-primary" />
              </div>
              <div className="bg-muted rounded-lg px-3 py-2">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Ask about your resume..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
            disabled={loading}
          />
          <Button size="icon" onClick={() => sendMessage(input)} disabled={!input.trim() || loading}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
