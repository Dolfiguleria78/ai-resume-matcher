import { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { FileText, Download, Eye, CheckCircle2, Briefcase, GraduationCap, Code2, Crown, ScanLine, Rocket } from 'lucide-react';
import { toast } from 'sonner';

interface TemplateSection {
  label: string;
  placeholder: string;
  multiline?: boolean;
}

interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ElementType;
  color: string;
  sections: TemplateSection[];
  preview: string;
}

const templates: ResumeTemplate[] = [
  {
    id: '1',
    name: 'Professional Classic',
    description: 'Clean and traditional layout perfect for corporate roles in finance, consulting, and management.',
    category: 'Professional',
    icon: Briefcase,
    color: 'from-blue-500 to-indigo-600',
    sections: [
      { label: 'Full Name', placeholder: 'John Smith' },
      { label: 'Job Title', placeholder: 'Senior Project Manager' },
      { label: 'Email', placeholder: 'john@example.com' },
      { label: 'Phone', placeholder: '+1 (555) 123-4567' },
      { label: 'Professional Summary', placeholder: 'Results-driven project manager with 8+ years of experience...', multiline: true },
      { label: 'Work Experience', placeholder: 'Company Name — Role — Duration\n• Key achievement 1\n• Key achievement 2', multiline: true },
      { label: 'Education', placeholder: 'University Name — Degree — Year', multiline: true },
      { label: 'Skills', placeholder: 'Leadership, Strategic Planning, Agile, Budgeting...', multiline: true },
    ],
    preview: `JOHN SMITH
Senior Project Manager
john@example.com | +1 (555) 123-4567

PROFESSIONAL SUMMARY
Results-driven project manager with 8+ years of experience leading cross-functional teams and delivering projects on time and under budget.

WORK EXPERIENCE
Acme Corp — Senior Project Manager — 2020–Present
• Led a team of 15 to deliver a $2M digital transformation project
• Improved delivery efficiency by 30% through Agile adoption

EDUCATION
MBA, Harvard Business School — 2018
BS Computer Science, MIT — 2014

SKILLS
Leadership, Strategic Planning, Agile, Budgeting, Stakeholder Management`,
  },
  {
    id: '2',
    name: 'Modern Creative',
    description: 'Bold design with color accents for creative industries like design, marketing, and media.',
    category: 'Creative',
    icon: Rocket,
    color: 'from-pink-500 to-rose-600',
    sections: [
      { label: 'Full Name', placeholder: 'Sarah Chen' },
      { label: 'Creative Title', placeholder: 'UI/UX Designer & Brand Strategist' },
      { label: 'Portfolio URL', placeholder: 'https://sarahchen.design' },
      { label: 'Email', placeholder: 'sarah@design.co' },
      { label: 'About Me', placeholder: 'Passionate designer blending aesthetics with user-centered thinking...', multiline: true },
      { label: 'Projects & Experience', placeholder: 'Project Name — Role\nDescription of impact and tools used', multiline: true },
      { label: 'Tools & Skills', placeholder: 'Figma, Adobe Suite, Sketch, Framer, HTML/CSS...', multiline: true },
      { label: 'Awards & Recognition', placeholder: 'Award Name — Year — Organization', multiline: true },
    ],
    preview: `✦ SARAH CHEN
UI/UX Designer & Brand Strategist
sarahchen.design | sarah@design.co

ABOUT ME
Passionate designer blending aesthetics with user-centered thinking. 6+ years crafting digital experiences for top brands.

FEATURED PROJECTS
Redesigned checkout flow for ShopEasy — Increased conversions by 42%
Brand identity system for TechStart — Used across 12 markets

TOOLS & SKILLS
Figma, Adobe Suite, Sketch, Framer, HTML/CSS, Motion Design

AWARDS
Webby Award — Best UX — 2023
Behance Featured — 2022`,
  },
  {
    id: '3',
    name: 'Tech Minimalist',
    description: 'Sleek, minimal layout optimized for software engineering and technical roles.',
    category: 'Tech',
    icon: Code2,
    color: 'from-emerald-500 to-teal-600',
    sections: [
      { label: 'Full Name', placeholder: 'Alex Kumar' },
      { label: 'Role', placeholder: 'Full-Stack Developer' },
      { label: 'GitHub / LinkedIn', placeholder: 'github.com/alexkumar' },
      { label: 'Email', placeholder: 'alex@dev.io' },
      { label: 'Technical Summary', placeholder: 'Full-stack developer specializing in React, Node.js, and cloud architecture...', multiline: true },
      { label: 'Tech Stack', placeholder: 'React, TypeScript, Node.js, Python, AWS, Docker, PostgreSQL...', multiline: true },
      { label: 'Experience', placeholder: 'Company — Role — Duration\n• Built microservices handling 10M+ requests/day', multiline: true },
      { label: 'Open Source / Projects', placeholder: 'Project name — Stars/Impact — Tech used', multiline: true },
    ],
    preview: `ALEX KUMAR
Full-Stack Developer
github.com/alexkumar | alex@dev.io

TECH STACK
React, TypeScript, Node.js, Python, AWS, Docker, PostgreSQL, Redis, GraphQL

EXPERIENCE
StreamCo — Senior Developer — 2021–Present
• Built microservices handling 10M+ requests/day
• Reduced API latency by 60% with Redis caching

OPEN SOURCE
react-table-pro — 2.1k stars — Advanced data table component
node-auth-kit — Authentication middleware for Express

EDUCATION
BS Computer Science, Stanford — 2019`,
  },
  {
    id: '4',
    name: 'Executive Summary',
    description: 'Premium layout for C-suite, VP, and senior management positions.',
    category: 'Executive',
    icon: Crown,
    color: 'from-amber-500 to-orange-600',
    sections: [
      { label: 'Full Name', placeholder: 'Dr. Michael Torres' },
      { label: 'Executive Title', placeholder: 'Chief Technology Officer' },
      { label: 'Email & Phone', placeholder: 'mtorres@exec.com | +1 (555) 999-0001' },
      { label: 'Executive Profile', placeholder: 'Visionary technology leader with 15+ years driving digital transformation...', multiline: true },
      { label: 'Key Achievements', placeholder: '• Scaled engineering team from 20 to 200+\n• Led $50M cloud migration initiative', multiline: true },
      { label: 'Leadership Experience', placeholder: 'Company — Title — Duration\nScope of responsibility and key metrics', multiline: true },
      { label: 'Board & Advisory Roles', placeholder: 'Organization — Role — Duration', multiline: true },
      { label: 'Education & Certifications', placeholder: 'Degree, Institution — Year', multiline: true },
    ],
    preview: `DR. MICHAEL TORRES
Chief Technology Officer
mtorres@exec.com | +1 (555) 999-0001

EXECUTIVE PROFILE
Visionary technology leader with 15+ years driving digital transformation across Fortune 500 companies. Proven track record of scaling teams and delivering billion-dollar initiatives.

KEY ACHIEVEMENTS
• Scaled engineering team from 20 to 200+ across 4 countries
• Led $50M cloud migration — completed 3 months ahead of schedule
• Increased platform reliability to 99.99% uptime

LEADERSHIP EXPERIENCE
GlobalTech Inc — CTO — 2019–Present
Overseeing 200+ engineers, $80M annual budget

EDUCATION
PhD Computer Science, Carnegie Mellon — 2010`,
  },
  {
    id: '5',
    name: 'ATS Optimized',
    description: 'Plain-text friendly format designed to pass Applicant Tracking System scanners.',
    category: 'ATS',
    icon: ScanLine,
    color: 'from-violet-500 to-purple-600',
    sections: [
      { label: 'Full Name', placeholder: 'Emily Johnson' },
      { label: 'Target Role', placeholder: 'Marketing Manager' },
      { label: 'Contact Info', placeholder: 'emily@email.com | (555) 234-5678 | LinkedIn: /in/emilyjohnson' },
      { label: 'Professional Summary', placeholder: 'Marketing manager with 5+ years in B2B SaaS...', multiline: true },
      { label: 'Core Competencies', placeholder: 'SEO, Content Strategy, Google Analytics, HubSpot, A/B Testing...', multiline: true },
      { label: 'Professional Experience', placeholder: 'Company Name | Role | Location | Dates\n• Achievement with metrics', multiline: true },
      { label: 'Education', placeholder: 'Degree | University | Year', multiline: true },
      { label: 'Certifications', placeholder: 'Google Analytics Certified — 2023', multiline: true },
    ],
    preview: `EMILY JOHNSON
Marketing Manager
emily@email.com | (555) 234-5678 | LinkedIn: /in/emilyjohnson

PROFESSIONAL SUMMARY
Marketing manager with 5+ years in B2B SaaS. Expert in SEO, content strategy, and demand generation with a data-driven approach.

CORE COMPETENCIES
SEO, Content Strategy, Google Analytics, HubSpot, A/B Testing, Email Marketing, Paid Ads

PROFESSIONAL EXPERIENCE
TechFlow Inc | Marketing Manager | San Francisco, CA | 2021–Present
• Grew organic traffic by 180% through content strategy overhaul
• Managed $500K annual ad budget with 3.2x ROAS

CERTIFICATIONS
Google Analytics Certified — 2023
HubSpot Inbound Marketing — 2022`,
  },
  {
    id: '6',
    name: 'Entry Level',
    description: 'Skills-focused layout for recent graduates and career starters.',
    category: 'Entry Level',
    icon: GraduationCap,
    color: 'from-cyan-500 to-blue-600',
    sections: [
      { label: 'Full Name', placeholder: 'Jordan Lee' },
      { label: 'Target Role', placeholder: 'Junior Software Developer' },
      { label: 'Email', placeholder: 'jordan@university.edu' },
      { label: 'Objective', placeholder: 'Enthusiastic CS graduate seeking to apply strong foundation in...', multiline: true },
      { label: 'Education', placeholder: 'University Name — Degree — GPA — Graduation Year', multiline: true },
      { label: 'Projects', placeholder: 'Project Name — Tech Stack\nDescription of what you built and impact', multiline: true },
      { label: 'Skills', placeholder: 'Python, JavaScript, React, SQL, Git...', multiline: true },
      { label: 'Activities & Leadership', placeholder: 'Club/Organization — Role — Achievements', multiline: true },
    ],
    preview: `JORDAN LEE
Junior Software Developer
jordan@university.edu | github.com/jordanlee

OBJECTIVE
Enthusiastic CS graduate seeking to apply strong foundation in web development and algorithms to a junior developer role.

EDUCATION
BS Computer Science, UC Berkeley — GPA: 3.8 — 2024

PROJECTS
TaskFlow App — React, Node.js, MongoDB
• Built a project management app with real-time collaboration
• 500+ active users during university beta launch

SKILLS
Python, JavaScript, React, Node.js, SQL, Git, Docker

ACTIVITIES
ACM Club — Vice President — Organized 12 tech talks with 200+ attendees`,
  },
];

export default function Templates() {
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<ResumeTemplate | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);

  const handleSelect = (template: ResumeTemplate) => {
    setSelectedTemplate(template);
    setActiveTemplate(template.id);
    const initial: Record<string, string> = {};
    template.sections.forEach(s => { initial[s.label] = ''; });
    setFormData(initial);
  };

  const handleDownload = () => {
    if (!selectedTemplate) return;

    const lines: string[] = [];
    selectedTemplate.sections.forEach(section => {
      const value = formData[section.label]?.trim() || section.placeholder;
      lines.push(section.label.toUpperCase());
      lines.push(value);
      lines.push('');
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTemplate.name.replace(/\s+/g, '_')}_Resume.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Resume downloaded!');
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" /> Resume Templates
          </h1>
          <p className="text-sm text-muted-foreground">Choose a template, fill in your details, and download your resume</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {templates.map((tpl, i) => {
            const Icon = tpl.icon;
            const isActive = activeTemplate === tpl.id;
            return (
              <motion.div
                key={tpl.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className={`border-border/50 hover:shadow-lg transition-all group h-full flex flex-col cursor-pointer ${isActive ? 'ring-2 ring-primary border-primary/40' : 'hover:border-primary/20'}`}>
                  <CardContent className="p-5 flex flex-col h-full gap-4">
                    {/* Header with gradient icon */}
                    <div className={`w-full h-28 rounded-lg bg-gradient-to-br ${tpl.color} flex items-center justify-center relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/10" />
                      <Icon className="w-12 h-12 text-white relative z-10" />
                      {isActive && (
                        <div className="absolute top-2 right-2 z-10">
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <h3 className="font-display font-semibold text-sm text-foreground">{tpl.name}</h3>
                      <Badge variant="secondary" className="text-xs">{tpl.category}</Badge>
                    </div>

                    <p className="text-xs text-muted-foreground flex-1">{tpl.description}</p>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={(e) => { e.stopPropagation(); setPreviewTemplate(tpl); }}
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" /> Preview
                      </Button>
                      <Button
                        variant={isActive ? 'default' : 'hero'}
                        size="sm"
                        className="flex-1"
                        onClick={(e) => { e.stopPropagation(); handleSelect(tpl); }}
                      >
                        {isActive ? <><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Selected</> : 'Use Template'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Edit form */}
        {selectedTemplate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <Card className="border-primary/20">
              <CardContent className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display font-bold text-lg text-foreground">
                      Edit: {selectedTemplate.name}
                    </h2>
                    <p className="text-xs text-muted-foreground">Fill in your details below, then download</p>
                  </div>
                  <Button variant="hero" onClick={handleDownload}>
                    <Download className="w-4 h-4 mr-1" /> Download Resume
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedTemplate.sections.map(section => (
                    <div key={section.label} className={section.multiline ? 'md:col-span-2' : ''}>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">{section.label}</label>
                      {section.multiline ? (
                        <Textarea
                          placeholder={section.placeholder}
                          value={formData[section.label] || ''}
                          onChange={e => setFormData(prev => ({ ...prev, [section.label]: e.target.value }))}
                          className="min-h-[100px] resize-none"
                        />
                      ) : (
                        <Input
                          placeholder={section.placeholder}
                          value={formData[section.label] || ''}
                          onChange={e => setFormData(prev => ({ ...prev, [section.label]: e.target.value }))}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Preview Dialog */}
      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">{previewTemplate?.name} — Preview</DialogTitle>
          </DialogHeader>
          <pre className="whitespace-pre-wrap text-sm font-mono bg-muted/50 rounded-lg p-5 border border-border/50 text-foreground leading-relaxed">
            {previewTemplate?.preview}
          </pre>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewTemplate(null)}>Close</Button>
            <Button variant="hero" onClick={() => { handleSelect(previewTemplate!); setPreviewTemplate(null); }}>
              Use This Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
