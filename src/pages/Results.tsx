import { Download, ArrowRight, CheckCircle2, AlertTriangle, XCircle, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import GlassCard from "@/components/GlassCard";
import ScoreRing from "@/components/ScoreRing";

const matchedKeywords = ["React", "TypeScript", "Node.js", "REST APIs", "Git", "Agile", "CI/CD", "AWS"];
const missingKeywords = ["GraphQL", "Docker", "Kubernetes", "Terraform"];
const partialKeywords = ["Python", "SQL"];

const skillGaps = [
  { skill: "GraphQL", level: "Required", suggestion: "Add GraphQL experience from any projects or coursework" },
  { skill: "Docker", level: "Preferred", suggestion: "Include containerization experience, even personal projects" },
  { skill: "Kubernetes", level: "Nice to have", suggestion: "Mention any orchestration or cloud-native experience" },
];

const suggestions = [
  { type: "critical", text: "Add quantifiable metrics to your work experience (e.g., 'improved performance by 40%')" },
  { type: "critical", text: "Include GraphQL in your skills section — it's a required skill" },
  { type: "warning", text: "Your summary could be more targeted to this specific role" },
  { type: "warning", text: "Add Docker/containerization experience to your technical skills" },
  { type: "info", text: "Consider adding a 'Projects' section to showcase relevant side projects" },
  { type: "info", text: "Your resume length is ideal at 1 page" },
];

const originalExcerpt = `Experienced software developer with 5+ years of experience building web applications. Proficient in React, TypeScript, and Node.js. Strong problem-solving skills and ability to work in team environments.`;

const improvedExcerpt = `Results-driven Senior Frontend Engineer with 5+ years of experience delivering high-performance web applications at scale. Expert in React, TypeScript, and Node.js with proven track record of reducing load times by 40% and improving user engagement by 25%. Passionate about clean architecture, CI/CD automation, and cross-functional collaboration in Agile environments.`;

export default function Results() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Analysis Results</h1>
              <p className="text-muted-foreground mt-1">Senior Frontend Dev — Google</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" /> Export PDF
              </Button>
              <Button asChild className="gradient-primary text-primary-foreground border-0 hover:opacity-90">
                <Link to="/upload">New Analysis <ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            </div>
          </div>

          {/* Score Overview */}
          <div className="grid sm:grid-cols-3 gap-6 mb-8">
            <GlassCard className="flex flex-col items-center py-8">
              <ScoreRing score={87} size={130} label="ATS Match" />
            </GlassCard>
            <GlassCard className="flex flex-col items-center py-8">
              <ScoreRing score={72} size={130} label="Keyword Coverage" />
            </GlassCard>
            <GlassCard className="flex flex-col items-center py-8">
              <ScoreRing score={65} size={130} label="Skill Match" />
            </GlassCard>
          </div>

          <Tabs defaultValue="keywords" className="space-y-6">
            <TabsList className="glass-card border p-1 h-auto flex-wrap">
              <TabsTrigger value="keywords" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Keywords</TabsTrigger>
              <TabsTrigger value="skills" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Skill Gaps</TabsTrigger>
              <TabsTrigger value="suggestions" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Suggestions</TabsTrigger>
              <TabsTrigger value="comparison" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Comparison</TabsTrigger>
            </TabsList>

            {/* Keywords */}
            <TabsContent value="keywords">
              <GlassCard>
                <h3 className="font-semibold mb-4">Keyword Analysis</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-success mb-2 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Matched ({matchedKeywords.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {matchedKeywords.map((k) => (
                        <Badge key={k} className="bg-success/10 text-success border-success/20 hover:bg-success/20">{k}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-destructive mb-2 flex items-center gap-1">
                      <XCircle className="w-4 h-4" /> Missing ({missingKeywords.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {missingKeywords.map((k) => (
                        <Badge key={k} variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">{k}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-warning mb-2 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" /> Partial ({partialKeywords.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {partialKeywords.map((k) => (
                        <Badge key={k} className="bg-warning/10 text-warning border-warning/20 hover:bg-warning/20">{k}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </TabsContent>

            {/* Skill Gaps */}
            <TabsContent value="skills">
              <GlassCard>
                <h3 className="font-semibold mb-4">Skill Gap Analysis</h3>
                <div className="space-y-4">
                  {skillGaps.map((gap) => (
                    <div key={gap.skill} className="p-4 rounded-lg bg-secondary/50 border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{gap.skill}</span>
                        <Badge variant="outline" className="text-xs">{gap.level}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        {gap.suggestion}
                      </p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </TabsContent>

            {/* Suggestions */}
            <TabsContent value="suggestions">
              <GlassCard>
                <h3 className="font-semibold mb-4">Improvement Suggestions</h3>
                <div className="space-y-3">
                  {suggestions.map((s, i) => (
                    <div
                      key={i}
                      className={`p-4 rounded-lg border flex items-start gap-3 ${
                        s.type === "critical"
                          ? "bg-destructive/5 border-destructive/20"
                          : s.type === "warning"
                          ? "bg-warning/5 border-warning/20"
                          : "bg-info/5 border-info/20"
                      }`}
                    >
                      {s.type === "critical" ? (
                        <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                      ) : s.type === "warning" ? (
                        <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
                      )}
                      <p className="text-sm">{s.text}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </TabsContent>

            {/* Comparison */}
            <TabsContent value="comparison">
              <div className="grid md:grid-cols-2 gap-6">
                <GlassCard>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="outline" className="text-muted-foreground">Original</Badge>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{originalExcerpt}</p>
                </GlassCard>
                <GlassCard className="border-primary/30">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      <Sparkles className="w-3 h-3 mr-1" /> AI Improved
                    </Badge>
                  </div>
                  <p className="text-sm leading-relaxed">{improvedExcerpt}</p>
                </GlassCard>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
