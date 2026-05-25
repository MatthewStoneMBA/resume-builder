"use client";

import { useState } from "react";

type Props = {
  resume: string;
  coverLetter: string;
  onStartOver: () => void;
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="text-xs px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

export default function OutputView({ resume, coverLetter, onStartOver }: Props) {
  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <p className="text-green-800 font-semibold">Your tailored resume and cover letter are ready.</p>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-gray-800">Resume</h2>
          <CopyButton text={resume} />
        </div>
        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
            {resume}
          </pre>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-gray-800">Cover Letter</h2>
          <CopyButton text={coverLetter} />
        </div>
        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
            {coverLetter}
          </pre>
        </div>
      </div>

      <button
        onClick={onStartOver}
        className="w-full py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm"
      >
        Start Over
      </button>
    </div>
  );
}
