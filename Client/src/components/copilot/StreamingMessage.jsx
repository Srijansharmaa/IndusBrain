import React from "react";

export default function StreamingMessage({ text }) {
  return (
    <div className="flex justify-start">
      <div className="max-w-[82%] px-[15px] py-3 rounded-2xl rounded-bl-md bg-surface text-ink text-[13px] leading-relaxed">
        {text}
        <span className="opacity-40">\u258c</span>
      </div>
    </div>
  );
}
