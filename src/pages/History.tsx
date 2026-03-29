import { FileText, Trash2, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import GlassCard from "@/components/GlassCard";

const history = [
  { id: 1, title: "Senior Frontend Dev — Google", score: 87, date: "Mar 25, 2026", file: "resume_v4.pdf" },
  { id: 2, title: "Full Stack Engineer — Stripe", score: 72, date: "Mar 24, 2026", file: "resume_v3.pdf" },
  { id: 3, title: "React Developer — Vercel", score: 91, date: "Mar 22, 2026", file: "resume_v4.pdf" },
  { id: 4, title: "Software Engineer — Meta", score: 65, date: "Mar 20, 2026", file: "resume_v2.pdf" },
  { id: 5, title: "Backend Engineer — Shopify", score: 58, date: "Mar 18, 2026", file: "resume_v1.pdf" },
  { id: 6, title: "DevOps Engineer — Netflix", score: 44, date: "Mar 15, 2026", file: "resume_v1.pdf" },
];

export default function History() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">History</h1>
              <p className="text-muted-foreground mt-1">Your past resume analyses</p>
            </div>
            <Button asChild className="gradient-primary text-primary-foreground border-0 hover:opacity-90">
              <Link to="/upload">New Analysis</Link>
            </Button>
          </div>

          <div className="space-y-3">
            {history.map((item, i) => (
              <GlassCard
                key={item.id}
                hover
                className="animate-fade-in"
                style={{ animationDelay: `${i * 0.05}s` } as React.CSSProperties}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.file} · {item.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`text-lg font-bold ${
                        item.score >= 80 ? "text-success" : item.score >= 60 ? "text-warning" : "text-destructive"
                      }`}
                    >
                      {item.score}%
                    </span>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to="/results"><ExternalLink className="w-4 h-4" /></Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
