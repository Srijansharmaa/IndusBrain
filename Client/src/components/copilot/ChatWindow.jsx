import React, { useEffect, useRef } from "react";
import { Bot } from "lucide-react";
import Badge from "../common/Badge";
import ChatMessage from "./ChatMessage";
import StreamingMessage from "./StreamingMessage";
import TypingIndicator from "./TypingIndicator";
import SuggestedQueries from "./SuggestedQueries";
import ChatInput from "./ChatInput";

export default function ChatWindow({ messages, streaming, streamedText, asking, onAsk, suggestedQueries, onSourceClick }) {
  // Follow-up suggestion chips reuse the same "ask" flow as typing a query.
  const onSuggestionClick = onAsk;
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamedText, asking]);

  return (
    <div className="flex flex-col bg-card rounded-card border border-hairline overflow-hidden h-full">
      <div className="px-5 py-4 border-b border-hairline flex items-center gap-2">
        <Bot size={17} className="text-primary" />
        <span className="font-bold text-[14.5px] text-ink">AI Copilot</span>
        <Badge tone="success">Connected to Knowledge Graph</Badge>
      </div>

      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3.5">
        {messages.map((message, i) => (
          <ChatMessage key={i} {...message} onSourceClick={onSourceClick} onSuggestionClick={onSuggestionClick} />
        ))}
        {asking && !streaming && <TypingIndicator />}
        {streaming && <StreamingMessage text={streamedText} />}
        <div ref={endRef} />
      </div>

      <div className="p-4 border-t border-hairline">
        <SuggestedQueries queries={suggestedQueries} onSelect={onAsk} disabled={streaming || asking} />
        <ChatInput onSend={onAsk} disabled={streaming || asking} />
      </div>
    </div>
  );
}
