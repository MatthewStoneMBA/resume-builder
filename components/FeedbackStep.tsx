"use client";

import { useState } from "react";
import { FEEDBACK_QUESTIONS } from "@/lib/prompts";

type Props = {
  preOutputs: string[];
  onContinue: (feedback: string) => void;
};

export default function FeedbackStep({ preOutputs, onContinue }: Props) {
  const [answers, setAnswers] = useState<string[]>(FEEDBACK_QUESTIONS.map(() => ""));

  const handleContinue = () => {
    const combined = FEEDBACK_QUESTIONS.map((q, i) => `Q: ${q}\nA: ${answers[i]}`).join("\n\n");
    onContinue(combined);
  };

  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm font-semibold text-green-800">
          ✓ Analysis complete — a few quick questions before we write your resume
        </p>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-48 overflow-y-auto">
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2">Draft analysis</p>
        <div className="text-xs text-gray-600 whitespace-pre-wrap font-mono leading-relaxed">
          {preOutputs[preOutputs.length - 1]}
        </div>
      </div>

      <div className="space-y-5">
        {FEEDBACK_QUESTIONS.map((question, i) => (
          <div key={i}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {i + 1}. {question}
            </label>
            <textarea
              value={answers[i]}
              onChange={(e) => {
                const next = [...answers];
                next[i] = e.target.value;
                setAnswers(next);
              }}
              placeholder="Your answer..."
              className="w-full h-20 p-3 border border-gray-300 rounded-lg resize-y text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleContinue}
        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
      >
        Finalize Resume & Cover Letter →
      </button>
    </div>
  );
}
