"use client";

type Props = {
  resume: string;
  jobPosting: string;
  extraContext: string;
  onChange: (field: "resume" | "jobPosting" | "extraContext", value: string) => void;
  onSubmit: () => void;
};

export default function StepInputs({ resume, jobPosting, extraContext, onChange, onSubmit }: Props) {
  const ready = resume.trim() && jobPosting.trim();

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Your Resume <span className="text-red-500">*</span>
        </label>
        <textarea
          value={resume}
          onChange={(e) => onChange("resume", e.target.value)}
          placeholder="Paste your full resume here..."
          className="w-full h-48 p-3 border border-gray-300 rounded-lg resize-y text-sm font-mono text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Job Posting <span className="text-red-500">*</span>
        </label>
        <textarea
          value={jobPosting}
          onChange={(e) => onChange("jobPosting", e.target.value)}
          placeholder="Paste the full job description here..."
          className="w-full h-48 p-3 border border-gray-300 rounded-lg resize-y text-sm font-mono text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Extra Context <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          value={extraContext}
          onChange={(e) => onChange("extraContext", e.target.value)}
          placeholder="Anything else that might help — company culture, why you want this role, specific projects to highlight, referral context..."
          className="w-full h-28 p-3 border border-gray-300 rounded-lg resize-y text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={onSubmit}
        disabled={!ready}
        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Generate My Resume & Cover Letter →
      </button>
    </div>
  );
}
