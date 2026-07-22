import React from "react";
import { X } from "lucide-react";

export default function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-card border border-hairline shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-hairline">
          <h3 className="text-[14.5px] font-bold text-ink">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-surface transition">
            <X size={16} className="text-subtext" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
