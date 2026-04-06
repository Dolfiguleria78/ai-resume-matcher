import { useLocation, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import ScoreRing from '@/components/ScoreRing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import type { AnalysisResult } from '@/types/resume';

const CHART_COLORS = [
  'hsl(243, 75%, 59%)',
  'hsl(167, 72%, 60%)',
  'hsl(38, 92%, 50%)',
  'hsl(0, 84%, 60%)',
  'hsl(210, 92%, 55%)',
];

export default function Analytics() {
  const location = useLocation();
  const state = location.state as { analysis?: AnalysisResult } | null;

  if (!state?.analysis) return <Navigate to="/dashboard" replace />;

  const { analysis } = state;
  const { sectionScores, matchedKeywords, missingKeywords, skills } = analysis;

  const sectionData = Object.entries(sectionScores).map(([key, val]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    score: val,
  }));

  const keywordPieData = [
    { name: 'Matched', value: matchedKeywords.length },
    { name: 'Missing', value: missingKeywords.length },
  ];

  const skillDistribution = skills.slice(0, 8).map((skill, i) => ({
    name: skill.length > 15 ? skill.substring(0, 15) + '…' : skill,
    relevance: Math.max(40, 100 - i * 8),
  }));

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-display font-bold text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground">Visual breakdown of your resume analysis</p>
        </motion.div>

        {/* Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'ATS Score', value: `${analysis.atsScore}%` },
            { label: 'Skills Found', value: skills.length },
            { label: 'Keywords Matched', value: matchedKeywords.length },
            { label: 'Gaps Found', value: analysis.skillGaps.length },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
              <Card className="border-border/50 text-center">
                <CardContent className="pt-5">
                  <p className="text-2xl font-display font-bold text-primary">{item.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-border/50">
              <CardHeader><CardTitle className="font-display">Section Scores</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={sectionData}>
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip
                      contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                      {sectionData.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Card className="border-border/50">
              <CardHeader><CardTitle className="font-display">Keyword Distribution</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={keywordPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                      <Cell fill="hsl(152, 69%, 45%)" />
                      <Cell fill="hsl(0, 84%, 60%)" />
                    </Pie>
                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Skill relevance */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border-border/50">
            <CardHeader><CardTitle className="font-display">Skill Match Relevance</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={skillDistribution} layout="vertical" margin={{ left: 20 }}>
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} width={120} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                  <Bar dataKey="relevance" radius={[0, 6, 6, 0]} fill="hsl(243, 75%, 59%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Score rings */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card className="border-border/50">
            <CardHeader><CardTitle className="font-display">Detailed Scores</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-8 justify-center py-4">
              {Object.entries(sectionScores).map(([key, val]) => (
                <ScoreRing key={key} score={val} size={100} label={key.charAt(0).toUpperCase() + key.slice(1)} />
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
}
