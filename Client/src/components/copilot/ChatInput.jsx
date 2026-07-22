import React, { useState } from "react";
import { Send } from "lucide-react";

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState("");

  const submit = () => {
    if (!value.trim()) return;
    onSend(value);
    setValue("");
  };

 return (
  <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-3 py-2 shadow-sm transition-all duration-300 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">
    
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && submit()}
      placeholder="Ask IndustrialIQ about equipment, compliance, maintenance..."
      className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none"
    />

    <button
      onClick={submit}
      disabled={disabled}
      className="
        flex h-11 w-11 items-center justify-center
        rounded-xl
        bg-gradient-to-r
        from-indigo-600
        to-violet-600
        text-white
        shadow-md
        transition-all
        duration-300
        hover:scale-105
        hover:shadow-xl
        hover:from-indigo-700
        hover:to-violet-700
        active:scale-95
        disabled:cursor-not-allowed
        disabled:opacity-50
      "
    >
      <Send size={18} />
    </button>

  </div>
);
}
