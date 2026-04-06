import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building2, MapPin, ExternalLink, Clock, DollarSign } from 'lucide-react';
import type { Job } from '@/components/JobRecommendations';

export default function JobDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const job = (location.state as { job?: Job })?.job;

  if (!job) return <Navigate to="/dashboard" replace />;

  const scoreColor = job.matchScore >= 75 ? 'text-success' : job.matchScore >= 50 ? 'text-warning' : 'text-destructive';

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-2">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>

        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-start gap-4">
              {job.companyLogo ? (
                <img src={job.companyLogo} alt={job.company} className="w-14 h-14 rounded-lg object-contain" />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center">
                  <Building2 className="w-7 h-7 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1">
                <CardTitle className="font-display text-xl">{job.title}</CardTitle>
                <p className="text-muted-foreground mt-1">{job.company}</p>
                <div className="flex items-center gap-3 mt-2 flex-wrap text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{job.location}</span>
                  <Badge variant="secondary">{job.type}</Badge>
                  {job.isRemote && <Badge variant="outline">Remote</Badge>}
                  <Badge className={`${job.matchScore >= 75 ? 'bg-success/10 text-success' : job.matchScore >= 50 ? 'bg-warning/10 text-warning' : 'bg-destructive/10 text-destructive'}`}>
                    {job.matchScore}% match
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {(job.minSalary || job.maxSalary) && (
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span>
                  {job.salaryCurrency} {job.minSalary?.toLocaleString()}{job.maxSalary ? ` – ${job.maxSalary.toLocaleString()}` : ''}
                  {job.salaryPeriod ? ` / ${job.salaryPeriod}` : ''}
                </span>
              </div>
            )}

            {job.postedAt && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                Posted {new Date(job.postedAt).toLocaleDateString()}
              </div>
            )}

            {job.requiredSkills?.length > 0 && (
              <div>
                <h3 className="font-medium text-sm mb-2">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills.map((skill, i) => (
                    <Badge key={i} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>
            )}

            {job.highlights?.Qualifications && (
              <div>
                <h3 className="font-medium text-sm mb-2">Qualifications</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {job.highlights.Qualifications.slice(0, 8).map((q, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.highlights?.Responsibilities && (
              <div>
                <h3 className="font-medium text-sm mb-2">Responsibilities</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {job.highlights.Responsibilities.slice(0, 8).map((r, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h3 className="font-medium text-sm mb-2">Job Description</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                {job.description}
              </p>
            </div>

            <a href={job.link} target="_blank" rel="noopener noreferrer" className="block">
              <Button className="w-full" size="lg">
                <ExternalLink className="w-4 h-4 mr-2" /> Apply Now
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
