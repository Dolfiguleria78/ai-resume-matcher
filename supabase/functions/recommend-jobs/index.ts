import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const JSEARCH_ENDPOINT = "https://jsearch.p.rapidapi.com/search";
const JSEARCH_HOST = "jsearch.p.rapidapi.com";

type RawJob = {
  job_id?: string;
  job_title?: string;
  employer_name?: string;
  employer_logo?: string | null;
  job_city?: string | null;
  job_state?: string | null;
  job_country?: string | null;
  job_employment_type?: string | null;
  job_apply_link?: string | null;
  job_google_link?: string | null;
  job_description?: string | null;
  job_posted_at_datetime_utc?: string | null;
  job_min_salary?: number | null;
  job_max_salary?: number | null;
  job_salary_currency?: string | null;
  job_salary_period?: string | null;
  job_required_skills?: string[] | null;
  job_highlights?: Record<string, string[]> | null;
  job_is_remote?: boolean | null;
};

function getRapidApiKey(): string | undefined {
  return Deno.env.get("RAPIDAPI_KEY") ?? globalThis.process?.env?.RAPIDAPI_KEY;
}

function calculateMatchScore(skills: string[], jobDescription: string): number {
  if (!skills.length || !jobDescription) return 50;
  const desc = jobDescription.toLowerCase();
  const matched = skills.filter((skill) => desc.includes(skill.toLowerCase()));
  return Math.min(99, Math.round((matched.length / skills.length) * 100) + 15);
}

function buildQuery(skills: string[], jobTitle?: string): string {
  const cleanSkills = skills
    .map((skill) => skill?.trim())
    .filter((skill): skill is string => Boolean(skill))
    .slice(0, 5);

  if (jobTitle?.trim()) return jobTitle.trim();
  if (!cleanSkills.length) return "software developer";
  return `${cleanSkills.join(" ")} developer`;
}

function mapJob(job: RawJob, skills: string[], fallbackId?: string) {
  return {
    id: job.job_id || fallbackId || crypto.randomUUID(),
    title: job.job_title || "Untitled",
    company: job.employer_name || "Unknown",
    companyLogo: job.employer_logo || null,
    location: job.job_city
      ? `${job.job_city}${job.job_state ? `, ${job.job_state}` : ""}${job.job_country ? `, ${job.job_country}` : ""}`
      : job.job_country || "Remote",
    type: job.job_employment_type || "Full-time",
    link: job.job_apply_link || job.job_google_link || "#",
    description: job.job_description?.slice(0, 500) || "No description available.",
    matchScore: calculateMatchScore(skills, job.job_description || ""),
    postedAt: job.job_posted_at_datetime_utc || null,
    minSalary: job.job_min_salary || null,
    maxSalary: job.job_max_salary || null,
    salaryCurrency: job.job_salary_currency || "USD",
    salaryPeriod: job.job_salary_period || null,
    requiredSkills: job.job_required_skills || [],
    highlights: job.job_highlights || {},
    isRemote: job.job_is_remote || false,
  };
}

function buildFallbackJobs(skills: string[], query: string) {
  const topSkills = skills.slice(0, 3);
  const sharedDescription = topSkills.length
    ? `Suggested roles related to ${topSkills.join(", ")} while live jobs are temporarily unavailable.`
    : "Suggested roles while live jobs are temporarily unavailable.";

  return [
    {
      id: `fallback-${crypto.randomUUID()}`,
      title: query,
      company: "Live job feed unavailable",
      companyLogo: null,
      location: "Remote",
      type: "Full-time",
      link: "#",
      description: `${sharedDescription} Please try refreshing again shortly.`,
      matchScore: 72,
      postedAt: null,
      minSalary: null,
      maxSalary: null,
      salaryCurrency: "USD",
      salaryPeriod: null,
      requiredSkills: topSkills,
      highlights: { Qualifications: topSkills },
      isRemote: true,
    },
    {
      id: `fallback-${crypto.randomUUID()}`,
      title: topSkills[0] ? `${topSkills[0]} Engineer` : "Software Engineer",
      company: "Sample Opportunity",
      companyLogo: null,
      location: "Hybrid",
      type: "Contract",
      link: "#",
      description: sharedDescription,
      matchScore: 68,
      postedAt: null,
      minSalary: null,
      maxSalary: null,
      salaryCurrency: "USD",
      salaryPeriod: null,
      requiredSkills: topSkills,
      highlights: { Skills: topSkills },
      isRemote: false,
    },
  ];
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const RAPIDAPI_KEY = getRapidApiKey();
    if (!RAPIDAPI_KEY) {
      console.error("recommend-jobs error: RAPIDAPI_KEY is not configured");
      return new Response(JSON.stringify({ jobs: buildFallbackJobs([], "software developer"), source: "fallback", error: "RAPIDAPI_KEY is not configured" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { skills, jobTitle } = await req.json();

    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return new Response(JSON.stringify({ error: "Missing skills array" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const query = buildQuery(skills, jobTitle);
    const url = new URL(JSEARCH_ENDPOINT);
    url.searchParams.set("query", query);
    url.searchParams.set("page", "1");
    url.searchParams.set("num_pages", "1");
    url.searchParams.set("date_posted", "month");

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": RAPIDAPI_KEY,
        "X-RapidAPI-Host": JSEARCH_HOST,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`recommend-jobs upstream error: ${response.status} ${errorText}`);
      return new Response(JSON.stringify({
        jobs: buildFallbackJobs(skills, query),
        source: "fallback",
        error: `JSearch API failed with status ${response.status}`,
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiData = await response.json();
    const rawJobs = Array.isArray(apiData?.data) ? apiData.data as RawJob[] : [];
    const jobs = rawJobs.slice(0, 8).map((job) => mapJob(job, skills));
    jobs.sort((a, b) => b.matchScore - a.matchScore);

    return new Response(JSON.stringify({
      jobs: jobs.length ? jobs : buildFallbackJobs(skills, query),
      source: jobs.length ? "jsearch" : "fallback",
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("recommend-jobs error:", e);
    return new Response(JSON.stringify({
      jobs: buildFallbackJobs([], "software developer"),
      source: "fallback",
      error: e instanceof Error ? e.message : "Unknown error",
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
