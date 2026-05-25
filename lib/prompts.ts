export type PromptContext = {
  resume: string;
  jobPosting: string;
  extraContext: string;
  previousOutputs: string[];
  userFeedback?: string;
};

export const FEEDBACK_QUESTIONS = [
  "Is there anything specific about your experience or skills you'd like emphasized more?",
  "Are there any accomplishments or projects not in your resume that are relevant to this role?",
  "What tone do you want — formal and traditional, or modern and direct?",
];

function build(ctx: PromptContext): string {
  return `
RESUME:
${ctx.resume}

JOB POSTING:
${ctx.jobPosting}

ADDITIONAL CONTEXT:
${ctx.extraContext}
`.trim();
}

function buildWithHistory(ctx: PromptContext): string {
  const history = ctx.previousOutputs
    .map((o, i) => `[Step ${i + 1} Output]\n${o}`)
    .join("\n\n");
  return `${build(ctx)}\n\n${history}`.trim();
}

// ─── PRE-FEEDBACK PROMPTS ──────────────────────────────────────────────────
// Replace these with your brother's actual prompts.
// Each function receives the full context and returns a prompt string.

export const PRE_FEEDBACK_PROMPTS: ((ctx: PromptContext) => string)[] = [
  // Step 1 — Analyze the job posting
  (ctx) => `
You are a professional resume strategist.

Analyze the following job posting and extract:
1. The top 5 required skills or qualifications
2. The top 3 "nice to have" qualifications
3. The likely pain points this role is meant to solve
4. Key words and phrases that should appear in the resume and cover letter

${build(ctx)}
`.trim(),

  // Step 2 — Analyze the candidate's resume
  (ctx) => `
You are a professional resume strategist.

Review the candidate's resume below and identify:
1. Their strongest relevant experiences for this specific job
2. Any gaps or weaknesses relative to the job requirements
3. Accomplishments that should be highlighted
4. Skills or keywords that are missing but likely in the candidate's background

${buildWithHistory(ctx)}
`.trim(),

  // Step 3 — Draft a tailored resume
  (ctx) => `
You are an expert resume writer.

Using the job analysis and candidate analysis above, write a fully tailored, ATS-optimized resume for this candidate.

Requirements:
- Use bullet points starting with strong action verbs
- Quantify achievements where possible
- Mirror keywords from the job posting naturally
- Keep to 1 page if experience is under 10 years, 2 pages if more
- Use clean, simple formatting (no tables or columns)

${buildWithHistory(ctx)}
`.trim(),
];

// ─── POST-FEEDBACK PROMPTS ─────────────────────────────────────────────────

export const POST_FEEDBACK_PROMPTS: ((ctx: PromptContext) => string)[] = [
  // Step 4 — Refine the resume based on feedback
  (ctx) => `
You are an expert resume writer.

Revise the draft resume from Step 3 based on the following user feedback:

USER FEEDBACK:
${ctx.userFeedback}

Make targeted improvements only. Do not change things the user did not mention.

${buildWithHistory(ctx)}
`.trim(),

  // Step 5 — Write the cover letter
  (ctx) => `
You are an expert cover letter writer.

Write a compelling, personalized cover letter for this candidate based on:
- The final tailored resume
- The job posting
- The user's feedback and preferences

Requirements:
- 3–4 paragraphs
- Opening: strong hook, name the specific role and company
- Middle: 2 specific examples of relevant accomplishments
- Closing: confident call to action
- Tone: match the user's stated preference (check the feedback)
- Do NOT use clichés like "I am writing to express my interest"

${buildWithHistory(ctx)}
`.trim(),
];
