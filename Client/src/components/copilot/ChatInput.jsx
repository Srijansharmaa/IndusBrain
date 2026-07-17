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
    <div className="flex gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="Ask about equipment, incidents, compliance\u2026"
        className="flex-1 px-3.5 py-2.5 rounded-xl border border-hairline text-[13px] outline-none font-sans"
      />
      <button
        onClick={submit}
        disabled={disabled}
        className="flex items-center justify-center px-4 rounded-xl border-none bg-primary text-white cursor-pointer disabled:opacity-60"
      >
        <Send size={15} />
      </button>
    </div>
  );
}
