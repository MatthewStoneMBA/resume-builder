"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const PASSPHRASE = process.env.NEXT_PUBLIC_PASSPHRASE ?? "resumebuilder";

export default function Home() {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleEnter = () => {
    if (input.trim().toLowerCase() === PASSPHRASE.toLowerCase()) {
      router.push("/build");
    } else {
      setError(true);
      setInput("");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-sm w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6 text-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resume Builder</h1>
          <p className="text-sm text-gray-500 mt-1">AI-powered resumes & cover letters</p>
        </div>

        <div className="space-y-3">
          <input
            type="password"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(false); }}
            onKeyDown={(e) => e.key === "Enter" && handleEnter()}
            placeholder="Enter passphrase"
            className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? "border-red-400" : "border-gray-300"
            }`}
          />
          {error && <p className="text-red-500 text-xs">Incorrect passphrase.</p>}
          <button
            onClick={handleEnter}
            className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Enter
          </button>
        </div>
      </div>
    </main>
  );
}
