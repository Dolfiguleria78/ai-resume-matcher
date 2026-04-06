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

    const { fileBase64, fileName, fileType, jobDescription } = await req.json();

    if (!fileBase64 || !jobDescription) {
      return new Response(JSON.stringify({ error: "Missing file or job description" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `You are an expert resume analyzer and ATS specialist. Analyze the resume text against the job description. You MUST respond with valid JSON only, no markdown.

Return this exact JSON structure:
{
  "candidate": { "name": "", "email": "", "phone": "", "location": "", "linkedin": "" },
  "skills": ["skill1", "skill2"],
  "experience": ["experience summary 1", "experience summary 2"],
  "education": ["education entry 1"],
  "atsScore": 75,
  "matchedKeywords": ["keyword1", "keyword2"],
  "missingKeywords": ["keyword1", "keyword2"],
  "skillGaps": ["gap description 1"],
  "improvements": ["improvement suggestion 1"],
  "warnings": ["warning about missing section or formatting issue"],
  "sectionScores": { "skills": 80, "experience": 70, "education": 60, "formatting": 85, "keywords": 65 }
}

Rules:
- atsScore: 0-100 based on keyword match, formatting, completeness
- All section scores: 0-100
- Be specific in improvements and warnings
- Detect missing fields (email, phone, etc.) and add to warnings
- Match keywords from the job description against the resume`;

    const userPrompt = `Resume file: ${fileName} (${fileType})
Resume content (base64): ${fileBase64.substring(0, 50000)}

Job Description:
${jobDescription}

Analyze this resume against the job description. Extract all candidate details, skills, experience, education. Calculate ATS compatibility score. Identify matched and missing keywords. Provide improvement suggestions. Return valid JSON only.`;

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
            name: "return_analysis",
            description: "Return the resume analysis results",
            parameters: {
              type: "object",
              properties: {
                candidate: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    email: { type: "string" },
                    phone: { type: "string" },
                    location: { type: "string" },
                    linkedin: { type: "string" },
                  },
                  required: ["name", "email", "phone", "location", "linkedin"],
                },
                skills: { type: "array", items: { type: "string" } },
                experience: { type: "array", items: { type: "string" } },
                education: { type: "array", items: { type: "string" } },
                atsScore: { type: "number" },
                matchedKeywords: { type: "array", items: { type: "string" } },
                missingKeywords: { type: "array", items: { type: "string" } },
                skillGaps: { type: "array", items: { type: "string" } },
                improvements: { type: "array", items: { type: "string" } },
                warnings: { type: "array", items: { type: "string" } },
                sectionScores: {
                  type: "object",
                  properties: {
                    skills: { type: "number" },
                    experience: { type: "number" },
                    education: { type: "number" },
                    formatting: { type: "number" },
                    keywords: { type: "number" },
                  },
                  required: ["skills", "experience", "education", "formatting", "keywords"],
                },
              },
              required: ["candidate", "skills", "experience", "education", "atsScore", "matchedKeywords", "missingKeywords", "skillGaps", "improvements", "warnings", "sectionScores"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "return_analysis" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage limit reached. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      throw new Error("AI analysis failed");
    }

    const aiData = await response.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) {
      throw new Error("No analysis results returned");
    }

    const analysis = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-resume error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
