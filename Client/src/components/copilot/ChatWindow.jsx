import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import SuggestedQueries from "./SuggestedQueries";
import StreamingMessage from "./StreamingMessage";

function ChatWindow({
  messages,
  streamedText,
  streaming,
  onAsk,
  suggestedQueries,
}) {
  return (
    <div className="flex h-full flex-col rounded-2xl border bg-white shadow-sm">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-6 px-4 py-4">
        {messages.map((msg, index) => (
          <ChatMessage
            key={index}
            role={msg.role}
            text={msg.text}
            meta={msg.meta}
          />
        ))}

        {streamedText && (
          <StreamingMessage text={streamedText} />
        )}
      </div>

      {/* Suggested Queries */}
      {suggestedQueries.length > 0 && (
        <div className="border-t px-4 pt-4">
          <SuggestedQueries
            queries={suggestedQueries}
            onSelect={onAsk}
            disabled={streaming}
          />
        </div>
      )}

      {/* Chat Input */}
      <div className="border-t p-4">
        <ChatInput
          onSend={onAsk}
          disabled={streaming}
        />
      </div>
    </div>
  );
}

export default ChatWindow;