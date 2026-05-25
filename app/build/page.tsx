"use client";

import { useState } from "react";
import StepInputs from "@/components/StepInputs";
import ProgressView from "@/components/ProgressView";
import FeedbackStep from "@/components/FeedbackStep";
import OutputView from "@/components/OutputView";
import { PRE_FEEDBACK_PROMPTS, POST_FEEDBACK_PROMPTS } from "@/lib/prompts";
import type { PromptContext } from "@/lib/prompts";

type Stage = "inputs" | "pre-running" | "feedback" | "post-running" | "done";

const PRE_LABELS = [
  "Analyzing job posting",
  "Reviewing your resume",
  "Drafting tailored resume",
];

const POST_LABELS = [
  "Refining resume with your feedback",
  "Writing cover letter",
];

async function runStep(
  phase: "pre" | "post",
  stepIndex: number,
  context: PromptContext,
  onChunk: (text: string) => void
): Promise<string> {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phase, stepIndex, context }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Generation failed (${res.status})`);
  }

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let full = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value);
    full += chunk;
    onChunk(chunk);
  }

  return full;
}

export default function BuildPage() {
  const [stage, setStage] = useState<Stage>("inputs");
  const [resume, setResume] = useState("");
  const [jobPosting, setJobPosting] = useState("");
  const [extraContext, setExtraContext] = useState("");
  const [preOutputs, setPreOutputs] = useState<string[]>([]);
  const [postOutputs, setPostOutputs] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [streamingText, setStreamingText] = useState("");
  const [userFeedback, setUserFeedback] = useState("");

  const baseContext: PromptContext = { resume, jobPosting, extraContext, previousOutputs: [] };

  const handleStart = async () => {
    setStage("pre-running");
    setPreOutputs([]);
    setCurrentStep(0);
    setStreamingText("");

    const outputs: string[] = [];

    for (let i = 0; i < PRE_FEEDBACK_PROMPTS.length; i++) {
      setCurrentStep(i);
      setStreamingText("");
      let stepOutput = "";

      await runStep(
        "pre",
        i,
        { ...baseContext, previousOutputs: outputs },
        (chunk) => {
          stepOutput += chunk;
          setStreamingText((prev) => prev + chunk);
        }
      );

      outputs.push(stepOutput);
      setPreOutputs([...outputs]);
    }

    setStage("feedback");
  };

  const handleFeedback = async (feedback: string) => {
    setUserFeedback(feedback);
    setStage("post-running");
    setPostOutputs([]);
    setCurrentStep(0);
    setStreamingText("");

    const outputs: string[] = [];

    for (let i = 0; i < POST_FEEDBACK_PROMPTS.length; i++) {
      setCurrentStep(i);
      setStreamingText("");
      let stepOutput = "";

      await runStep(
        "post",
        i,
        {
          ...baseContext,
          previousOutputs: preOutputs,
          userFeedback: feedback,
        },
        (chunk) => {
          stepOutput += chunk;
          setStreamingText((prev) => prev + chunk);
        }
      );

      outputs.push(stepOutput);
      setPostOutputs([...outputs]);
    }

    setStage("done");
  };

  const reset = () => {
    setStage("inputs");
    setResume("");
    setJobPosting("");
    setExtraContext("");
    setPreOutputs([]);
    setPostOutputs([]);
    setStreamingText("");
    setUserFeedback("");
    setCurrentStep(0);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Resume Builder</h1>
          <p className="text-gray-500 text-sm mt-1">AI-powered, tailored to your job posting</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {stage === "inputs" && (
            <StepInputs
              resume={resume}
              jobPosting={jobPosting}
              extraContext={extraContext}
              onChange={(field, value) => {
                if (field === "resume") setResume(value);
                if (field === "jobPosting") setJobPosting(value);
                if (field === "extraContext") setExtraContext(value);
              }}
              onSubmit={handleStart}
            />
          )}

          {stage === "pre-running" && (
            <ProgressView
              currentStep={currentStep}
              totalSteps={PRE_FEEDBACK_PROMPTS.length}
              phase="pre"
              streamingText={streamingText}
              stepLabels={PRE_LABELS}
            />
          )}

          {stage === "feedback" && (
            <FeedbackStep preOutputs={preOutputs} onContinue={handleFeedback} />
          )}

          {stage === "post-running" && (
            <ProgressView
              currentStep={currentStep}
              totalSteps={POST_FEEDBACK_PROMPTS.length}
              phase="post"
              streamingText={streamingText}
              stepLabels={POST_LABELS}
            />
          )}

          {stage === "done" && (
            <OutputView
              resume={postOutputs[0] ?? ""}
              coverLetter={postOutputs[1] ?? ""}
              onStartOver={reset}
            />
          )}
        </div>
      </div>
    </main>
  );
}
