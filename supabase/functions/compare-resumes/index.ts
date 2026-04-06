import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const body = await req.json();
    const { file1Base64, file1Name, file2Base64, file2Name, jobDescription } = body;

    if (!file1Base64 || !file2Base64 || !jobDescription) {
      return new Response(JSON.stringify({ error: "Missing files or job description" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `You are an expert resume comparison analyst. Compare two resumes against a job description. Return analysis for both resumes and determine the winner.`;

    const userPrompt = `Resume 1 (${file1Name}) content (base64): ${file1Base64.substring(0, 30000)}

Resume 2 (${file2Name}) content (base64): ${file2Base64.substring(0, 30000)}

Job Description:
${jobDescription}

Compare both resumes against the JD. For each, extract candidate info, skills, ATS score, matched/missing keywords, skill gaps, improvements. Determine winner.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "return_comparison",
            description: "Return comparison results for both resumes",
            parameters: {
              type: "object",
              properties: {
                resume1: {
                  type: "object",
                  properties: {
                    candidate: { type: "object", properties: { name: { type: "string" }, email: { type: "string" }, phone: { type: "string" }, location: { type: "string" }, linkedin: { type: "string" } }, required: ["name", "email", "phone", "location", "linkedin"] },
                    skills: { type: "array", items: { type: "string" } },
                    experience: { type: "array", items: { type: "string" } },
                    education: { type: "array", items: { type: "string" } },
                    atsScore: { type: "number" },
                    matchedKeywords: { type: "array", items: { type: "string" } },
                    missingKeywords: { type: "array", items: { type: "string" } },
                    skillGaps: { type: "array", items: { type: "string" } },
                    improvements: { type: "array", items: { type: "string" } },
                    warnings: { type: "array", items: { type: "string" } },
                    sectionScores: { type: "object", properties: { skills: { type: "number" }, experience: { type: "number" }, education: { type: "number" }, formatting: { type: "number" }, keywords: { type: "number" } }, required: ["skills", "experience", "education", "formatting", "keywords"] },
                  },
                  required: ["candidate", "skills", "experience", "education", "atsScore", "matchedKeywords", "missingKeywords", "skillGaps", "improvements", "warnings", "sectionScores"],
                },
                resume2: {
                  type: "object",
                  properties: {
                    candidate: { type: "object", properties: { name: { type: "string" }, email: { type: "string" }, phone: { type: "string" }, location: { type: "string" }, linkedin: { type: "string" } }, required: ["name", "email", "phone", "location", "linkedin"] },
                    skills: { type: "array", items: { type: "string" } },
                    experience: { type: "array", items: { type: "string" } },
                    education: { type: "array", items: { type: "string" } },
                    atsScore: { type: "number" },
                    matchedKeywords: { type: "array", items: { type: "string" } },
                    missingKeywords: { type: "array", items: { type: "string" } },
                    skillGaps: { type: "array", items: { type: "string" } },
                    improvements: { type: "array", items: { type: "string" } },
                    warnings: { type: "array", items: { type: "string" } },
                    sectionScores: { type: "object", properties: { skills: { type: "number" }, experience: { type: "number" }, education: { type: "number" }, formatting: { type: "number" }, keywords: { type: "number" } }, required: ["skills", "experience", "education", "formatting", "keywords"] },
                  },
                  required: ["candidate", "skills", "experience", "education", "atsScore", "matchedKeywords", "missingKeywords", "skillGaps", "improvements", "warnings", "sectionScores"],
                },
                winner: { type: "string", enum: ["resume1", "resume2", "tie"] },
                summary: { type: "string" },
              },
              required: ["resume1", "resume2", "winner", "summary"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "return_comparison" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage limit reached." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      throw new Error("AI comparison failed");
    }

    const aiData = await response.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) throw new Error("No results returned");

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("compare-resumes error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
