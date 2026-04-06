import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, ExternalLink, Sparkles, Loader2, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import type { AnalysisResult } from '@/types/resume';

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo: string | null;
  location: string;
  type: string;
  link: string;
  description: string;
  matchScore: number;
  postedAt: string | null;
  minSalary: number | null;
  maxSalary: number | null;
  salaryCurrency: string;
  salaryPeriod: string | null;
  requiredSkills: string[];
  highlights: Record<string, string[]>;
  isRemote: boolean;
}

interface JobRecommendationsProps {
  analysis: AnalysisResult | null;
}

export default function JobRecommendations({ analysis }: JobRecommendationsProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchJobs = async () => {
    if (!analysis) return toast.error('Analyze a resume first to get job recommendations');

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('recommend-jobs', {
        body: {
          skills: analysis.skills,
          experience: analysis.experience,
          jobTitle: undefined,
        },
      });

      if (error) throw error;

      const nextJobs = data?.jobs || [];
      if (data?.error && nextJobs.length === 0) throw new Error(data.error);

      setJobs(nextJobs);

      if (data?.source === 'fallback' && nextJobs.length > 0) {
        toast.info('Live jobs are temporarily unavailable, showing fallback recommendations.');
      } else if (nextJobs.length === 0) {
        toast.info('No jobs found. Try with different skills.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to get recommendations');
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (score: number) =>
    score >= 75 ? 'bg-success/10 text-success' : score >= 50 ? 'bg-warning/10 text-warning' : 'bg-destructive/10 text-destructive';

  const viewDetails = (job: Job) => {
    navigate(`/jobs/${encodeURIComponent(job.id)}`, { state: { job } });
  };

  if (jobs.length === 0) {
    return (
      <Card className="border-border/50">
        <CardContent className="flex flex-col items-center justify-center py-8 gap-3">
          <Briefcase className="w-10 h-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground text-center">
            {analysis ? 'Get real job recommendations based on your resume skills' : 'Analyze a resume first to see recommendations'}
          </p>
          <Button variant="hero" size="sm" onClick={fetchJobs} disabled={loading || !analysis}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? 'Searching Jobs...' : 'Find Real Jobs'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="font-display text-base flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" /> Recommended Jobs ({jobs.length})
          </CardTitle>
          <Button variant="outline" size="sm" onClick={fetchJobs} disabled={loading}>
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Refresh'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {jobs.map((job, i) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-3 rounded-lg border border-border/50 hover:border-primary/20 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                {job.companyLogo ? (
                  <img src={job.companyLogo} alt={job.company} className="w-8 h-8 rounded object-contain shrink-0" />
                ) : (
                  <div className="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-foreground truncate">{job.title}</h4>
                  <p className="text-xs text-muted-foreground">{job.company}</p>
                </div>
              </div>
              <Badge className={`${scoreColor(job.matchScore)} text-xs shrink-0`}>
                {job.matchScore}% match
              </Badge>
            </div>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
              <Badge variant="secondary" className="text-xs">{job.type}</Badge>
              {job.isRemote && <Badge variant="outline" className="text-xs">Remote</Badge>}
              {job.minSalary && (
                <span className="text-xs">
                  {job.salaryCurrency} {job.minSalary.toLocaleString()}{job.maxSalary ? `–${job.maxSalary.toLocaleString()}` : ''}
                  {job.salaryPeriod ? `/${job.salaryPeriod}` : ''}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{job.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <Button variant="link" size="sm" className="px-0 h-auto text-xs" onClick={() => viewDetails(job)}>
                <ExternalLink className="w-3 h-3 mr-1" /> View Details
              </Button>
              <a href={job.link} target="_blank" rel="noopener noreferrer">
                <Button size="sm" className="h-6 text-xs px-2">Apply Now</Button>
              </a>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
