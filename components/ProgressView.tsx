"use client";

type Props = {
  currentStep: number;
  totalSteps: number;
  phase: "pre" | "post";
  streamingText: string;
  stepLabels: string[];
};

export default function ProgressView({ currentStep, totalSteps, streamingText, stepLabels }: Props) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        {stepLabels.map((label, i) => {
          const done = i < currentStep;
          const active = i === currentStep;
          return (
            <div key={i} className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  done
                    ? "bg-green-500 text-white"
                    : active
                    ? "bg-blue-500 text-white animate-pulse"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {done ? "✓" : i + 1}
              </div>
              <span
                className={`text-sm ${
                  active ? "text-blue-700 font-semibold" : done ? "text-gray-500" : "text-gray-400"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {streamingText && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wide">
            Step {currentStep + 1} output
          </p>
          <div className="text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed max-h-64 overflow-y-auto">
            {streamingText}
            <span className="inline-block w-1.5 h-4 bg-blue-500 animate-pulse ml-0.5 align-text-bottom" />
          </div>
        </div>
      )}

      <p className="text-center text-sm text-gray-400">
        Step {Math.min(currentStep + 1, totalSteps)} of {totalSteps} — please wait...
      </p>
    </div>
  );
}
