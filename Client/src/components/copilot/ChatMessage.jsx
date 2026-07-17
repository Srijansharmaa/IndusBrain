import React from "react";
import ChatMetadata from "./ChatMetadata";
import { cx } from "../../utils/classNames";

export default function ChatMessage({ role, text, meta }) {
  const isUser = role === "user";
  return (
    <div className={cx("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cx(
          "max-w-[82%] px-[15px] py-3 rounded-2xl text-[13px] leading-relaxed",
          isUser
            ? "bg-primary text-white rounded-br-md"
            : "bg-surface text-ink rounded-bl-md"
        )}
      >
        {text}
        {meta && <ChatMetadata meta={meta} />}
      </div>
    </div>
  );
}
