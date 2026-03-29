import { FileText, TrendingUp, Target, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import StatCard from "@/components/StatCard";
import GlassCard from "@/components/GlassCard";
import ScoreRing from "@/components/ScoreRing";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const chartData = [
  { name: "Mon", score: 62 },
  { name: "Tue", score: 68 },
  { name: "Wed", score: 72 },
  { name: "Thu", score: 71 },
  { name: "Fri", score: 78 },
  { name: "Sat", score: 82 },
  { name: "Sun", score: 87 },
];

const recentActivity = [
  { title: "Senior Frontend Dev - Google", score: 87, date: "2 hours ago" },
  { title: "Full Stack Engineer - Stripe", score: 72, date: "1 day ago" },
  { title: "React Developer - Vercel", score: 91, date: "3 days ago" },
  { title: "Software Engineer - Meta", score: 65, date: "5 days ago" },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground mt-1">Track your resume optimization progress</p>
            </div>
            <Button asChild className="gradient-primary text-primary-foreground border-0 hover:opacity-90">
              <Link to="/upload">New Analysis <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={FileText} label="Resumes Analyzed" value="24" change="+3 this week" positive />
            <StatCard icon={TrendingUp} label="Avg. Score" value="78%" change="+12% improvement" positive />
            <StatCard icon={Target} label="Best Match" value="91%" change="React Dev @ Vercel" positive />
            <StatCard icon={Clock} label="Time Saved" value="18h" change="vs manual optimization" positive />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Chart */}
            <GlassCard className="lg:col-span-2">
              <h3 className="font-semibold mb-4">Score Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(175 80% 40%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(175 80% 40%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="hsl(175 80% 40%)"
                    fill="url(#scoreGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </GlassCard>

            {/* Score Overview */}
            <GlassCard className="flex flex-col items-center justify-center">
              <h3 className="font-semibold mb-6">Current Score</h3>
              <ScoreRing score={87} size={140} label="ATS Compatibility" />
            </GlassCard>
          </div>

          {/* Recent Activity */}
          <GlassCard className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Recent Activity</h3>
              <Link to="/history" className="text-sm text-primary hover:underline">View all</Link>
            </div>
            <div className="space-y-3">
              {recentActivity.map((item) => (
                <div
                  key={item.title}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.date}</p>
                    </div>
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      item.score >= 80 ? "text-success" : item.score >= 60 ? "text-warning" : "text-destructive"
                    }`}
                  >
                    {item.score}%
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </main>
    </div>
  );
}
