import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, Sparkles, GitCompare, BarChart3, MessageSquare, ArrowRight, CheckCircle, Zap, Shield, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  { icon: Sparkles, title: 'AI-Powered Analysis', desc: 'Extract skills, score ATS compatibility, and get actionable improvements', gradient: 'from-indigo-500 to-purple-500' },
  { icon: GitCompare, title: 'Resume Comparison', desc: 'Compare two resumes side-by-side to find the best candidate', gradient: 'from-purple-500 to-pink-500' },
  { icon: BarChart3, title: 'Visual Analytics', desc: 'Charts and insights on skill gaps, keyword distribution, and scoring', gradient: 'from-cyan-500 to-blue-500' },
  { icon: MessageSquare, title: 'Mock Interviews', desc: 'AI-generated interview questions tailored to your resume and role', gradient: 'from-emerald-500 to-teal-500' },
];

const benefits = [
  'ATS compatibility scoring (0–100%)',
  'Matched & missing keyword detection',
  'Smart error detection for missing fields',
  'PDF & DOCX file support',
  'Downloadable analysis reports',
  'Job-specific skill gap analysis',
];

const stats = [
  { value: '10K+', label: 'Resumes Analyzed', icon: FileText },
  { value: '95%', label: 'Accuracy Rate', icon: Zap },
  { value: '4.9★', label: 'User Rating', icon: Star },
  { value: '256-bit', label: 'Encryption', icon: Shield },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-background/60 backdrop-blur-xl border-b border-border/40">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <FileText className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">ResumeAI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">Sign In</Button>
            </Link>
            <Link to="/auth">
              <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 border-0 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-24 md:py-36 px-4">
        {/* Background decorations */}
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl" />

        <div className="container mx-auto text-center relative z-10 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-sm text-indigo-600 dark:text-indigo-400 mb-8">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered Resume Analysis Platform
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground leading-[1.1] tracking-tight">
              Analyze Resumes with{' '}
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
                AI Precision
              </span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Upload your resume, paste a job description, and get instant ATS scoring, skill gap analysis, and personalized improvement suggestions.
            </p>
            <div className="mt-10 flex gap-4 justify-center flex-wrap">
              <Link to="/auth">
                <Button size="lg" className="px-8 h-12 text-base bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 border-0 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5">
                  Start Analyzing <ArrowRight className="w-5 h-5 ml-1" />
                </Button>
              </Link>
              <a href="#features">
                <Button variant="outline" size="lg" className="px-8 h-12 text-base border-border/60 hover:bg-muted/50 transition-all duration-300">Learn More</Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 border-y border-border/40 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl md:text-4xl font-display font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">Everything You Need</h2>
            <p className="text-muted-foreground mt-3 text-lg">A complete AI-powered platform for resume optimization</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-7 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-500/20 transition-all duration-500 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display font-semibold text-xl text-foreground">{f.title}</h3>
                <p className="text-muted-foreground mt-2 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-background" />
        <div className="container mx-auto max-w-3xl text-center relative z-10">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-10">What You Get</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
              {benefits.map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-card/80 transition-colors duration-300"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-foreground">{b}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center p-12 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-cyan-500/10 border border-indigo-500/10 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">Ready to Optimize Your Resume?</h2>
              <p className="text-muted-foreground mt-3 mb-8 text-lg">Create a free account and get your first analysis in seconds.</p>
              <Link to="/auth">
                <Button size="lg" className="px-12 h-12 text-base bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 border-0 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5">
                  Get Started Free <ArrowRight className="w-5 h-5 ml-1" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-10 px-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} ResumeAI. Built with AI-powered analysis.
        </div>
      </footer>
    </div>
  );
}
