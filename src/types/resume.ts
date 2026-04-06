export interface CandidateDetails {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
}

export interface AnalysisResult {
  candidate: CandidateDetails;
  skills: string[];
  experience: string[];
  education: string[];
  atsScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  skillGaps: string[];
  improvements: string[];
  warnings: string[];
  sectionScores: {
    skills: number;
    experience: number;
    education: number;
    formatting: number;
    keywords: number;
  };
}

export interface ComparisonResult {
  resume1: AnalysisResult;
  resume2: AnalysisResult;
  winner: 'resume1' | 'resume2' | 'tie';
  summary: string;
}

export interface InterviewQuestion {
  question: string;
  category: 'technical' | 'behavioral' | 'hr';
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  preview: string;
}
