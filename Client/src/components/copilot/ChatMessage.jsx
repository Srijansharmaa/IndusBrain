import React from "react";
import { Bot, User } from "lucide-react";
import ChatMetadata from "./ChatMetadata";
import { cx } from "../../utils/classNames";

export default function ChatMessage({ role, text, meta }) {
  const isUser = role === "user";

  return (
    <div
      className={cx(
        "flex gap-3",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {/* AI Avatar */}
      {!isUser && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 text-white shadow-sm">
          <Bot size={18} />
        </div>
      )}

      {/* Message Bubble */}
      <div
        className={cx(
          "max-w-[78%] rounded-2xl px-5 py-4 text-sm leading-7 shadow-sm transition-all",
          isUser
            ? "rounded-br-md bg-gradient-to-r from-indigo-600 to-violet-600 text-white"
            : "rounded-bl-md border border-gray-200 bg-white text-slate-800"
        )}
      >
        <p className="whitespace-pre-wrap">{text}</p>

        {meta && (
          <div className="mt-4 border-t border-gray-100 pt-3">
            <ChatMetadata meta={meta} />
          </div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-slate-600 shadow-sm">
          <User size={18} />
        </div>
      )}
    </div>
  );
}