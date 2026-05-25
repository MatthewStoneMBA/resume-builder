# Resume Builder

[![Live Demo](https://img.shields.io/badge/Live%20Demo-resume--builder--seven--snowy--98.vercel.app-blue?style=for-the-badge)](https://resume-builder-seven-snowy-98.vercel.app)

An AI-powered web app that generates tailored resumes and cover letters. Paste your resume, a job posting, and some extra context — the app runs through a guided prompt sequence, pauses for your feedback mid-way, then delivers a polished resume and cover letter.

## How It Works

1. **Input** — paste your resume, the job posting, and any extra context
2. **AI Analysis** — the app analyzes the job requirements and your background
3. **Draft** — a tailored, ATS-optimized resume is generated
4. **Feedback** — you answer a few questions to refine the output
5. **Final Output** — a revised resume and a personalized cover letter

## Stack

- [Next.js](https://nextjs.org) — frontend + API routes
- [OpenAI GPT-4o](https://openai.com) — powers the prompt sequence
- [Vercel](https://vercel.com) — hosting and deployment

## Live App

[resume-builder-seven-snowy-98.vercel.app](https://resume-builder-seven-snowy-98.vercel.app)

## Local Development

1. Clone the repo
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file:
   ```
   OPENAI_API_KEY=your-openai-api-key
   NEXT_PUBLIC_PASSPHRASE=resumebuilder
   ```
4. Run the dev server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000)
