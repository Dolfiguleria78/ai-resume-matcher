import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Target, Zap, Shield, BarChart3, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import GlassCard from "@/components/GlassCard";
import Navbar from "@/components/Navbar";

const features = [
  { icon: Target, title: "ATS Match Score", desc: "Get real-time compatibility scores against job descriptions with AI-powered analysis." },
  { icon: Zap, title: "Instant Optimization", desc: "AI rewrites your resume to maximize keyword matches and improve structure." },
  { icon: Shield, title: "Skill Gap Analysis", desc: "Identify missing skills and get actionable recommendations to fill gaps." },
  { icon: BarChart3, title: "Analytics Dashboard", desc: "Track your progress across multiple applications with detailed insights." },
  { icon: FileText, title: "Multiple Formats", desc: "Upload PDF or DOCX files and export optimized resumes in any format." },
  { icon: Sparkles, title: "AI Suggestions", desc: "Get personalized improvement suggestions powered by advanced AI models." },
];

export default function Landing() {
  return (
    <div className="min-h-screen gradient-hero">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 px-4">
          <div className="container mx-auto text-center max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              AI-Powered Resume Optimization
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 animate-fade-in-up text-balance">
              Land Your Dream Job with{" "}
              <span className="gradient-text">AI-Optimized</span> Resumes
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              Upload your resume, paste a job description, and let our AI analyze, optimize, and transform your resume to beat ATS systems.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <Button asChild size="lg" className="gradient-primary text-primary-foreground border-0 hover:opacity-90 text-base px-8">
                <Link to="/upload">
                  Start Optimizing <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base px-8">
                <Link to="/dashboard">View Dashboard</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything You Need to Stand Out</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">Powerful AI tools designed to maximize your chances of landing interviews.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {features.map((f, i) => (
                <GlassCard key={f.title} hover className="animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s` } as React.CSSProperties}>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <f.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-3xl">
            <GlassCard className="text-center p-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Resume?</h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                Join thousands of job seekers who have improved their interview rates by up to 3x.
              </p>
              <Button asChild size="lg" className="gradient-primary text-primary-foreground border-0 hover:opacity-90 text-base px-8">
                <Link to="/upload">Get Started Free <ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            </GlassCard>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t py-8 px-4">
          <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <Sparkles className="w-4 h-4 text-primary" />
              ResumeAI
            </div>
            <p>© 2026 ResumeAI. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
