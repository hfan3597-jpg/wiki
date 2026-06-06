"use client";

import { useState } from "react";

interface QACardProps {
  question: {
    id: number;
    title: string;
    answer: string | null;
    explanation: string;
  };
}

export default function QACard({ question }: QACardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden transition-all">
      {/* Question Header - clickable */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-5 py-4 flex items-start justify-between gap-3 group hover:bg-zinc-800/30 transition-colors"
      >
        <div className="flex items-start gap-3">
          <span className="inline-block text-xs font-medium text-purple-400 bg-purple-400/10 rounded-full px-2 py-0.5 mt-0.5 flex-shrink-0">
            问答
          </span>
          <h3 className="text-base font-medium text-zinc-100 leading-relaxed group-hover:text-white transition-colors">
            {question.title}
          </h3>
        </div>
        <svg
          className={`w-5 h-5 text-zinc-500 flex-shrink-0 mt-0.5 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Answer + Explanation */}
      <div
        className={`explanation-enter ${expanded ? "show" : ""}`}
      >
        <div className="px-5 pb-5 space-y-3">
          {/* Answer */}
          {question.answer && (
            <div className="rounded-lg bg-purple-500/5 border border-purple-500/15 px-4 py-3.5">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-4 h-4 text-purple-400 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
                  答案
                </span>
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {question.answer}
              </p>
            </div>
          )}

          {/* Explanation */}
          {question.explanation && (
            <div className="rounded-lg bg-blue-500/5 border border-blue-500/15 px-4 py-3.5">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-4 h-4 text-blue-400 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                  />
                </svg>
                <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                  拓展知识
                </span>
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {question.explanation}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
