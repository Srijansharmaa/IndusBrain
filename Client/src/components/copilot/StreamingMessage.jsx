import React from "react";
import { Bot } from "lucide-react";

export default function StreamingMessage({ text }) {
  return (
    <div className="flex items-start gap-3">
      {/* AI Avatar */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-sm">
        <Bot size={18} />
      </div>

      {/* Streaming Bubble */}
      <div className="max-w-[78%] rounded-2xl rounded-bl-md border border-gray-200 bg-white px-5 py-4 shadow-sm">
        <p className="whitespace-pre-wrap text-sm leading-7 text-slate-800">
          {text}
          <span className="ml-1 inline-block animate-pulse text-indigo-600">
            ▌
          </span>
        </p>
      </div>
    </div>
  );
}