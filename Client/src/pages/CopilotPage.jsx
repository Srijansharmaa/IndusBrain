import React, { useEffect, useState, useCallback } from "react";
import ChatWindow from "../components/copilot/ChatWindow";
import KnowledgeGraphPanel from "../components/graph/KnowledgeGraphPanel";
import { useStreamingText } from "../hooks/useStreamingText";
import { askCopilot, getInitialMessage, getSuggestedQueries } from "../services/copilotService";
import { getHeroPath } from "../services/graphService";
import { useToast } from "../components/common/Toast";

export default function CopilotPage({ graph, pendingQuery, onConsumePendingQuery, onSearchDocuments }) {
  const [messages, setMessages] = useState([]);
  const [suggestedQueries, setSuggestedQueries] = useState([]);
  const [heroPath, setHeroPath] = useState([]);
  const [asking, setAsking] = useState(false);
  // Persists for the lifetime of the conversation. Captured from the
  // backend's response (metadata.sessionId) and resent on every
  // subsequent ask so the AI Orchestrator resolves follow-up questions
  // against the same session instead of starting a new one each message.
  const [sessionId, setSessionId] = useState(null);
  const toast = useToast();

  useEffect(() => {
    getInitialMessage().then((msg) => setMessages([msg]));
    getSuggestedQueries().then(setSuggestedQueries);
    getHeroPath().then(setHeroPath);
  }, []);

  const onPathStep = useCallback((path, node) => {
    graph.setActivePath(path);
    graph.setActiveNode(node);
  }, [graph]);

  const onDone = useCallback((fullText, meta) => {
    setMessages((prev) => [...prev, { role: "ai", text: fullText, meta }]);
  }, []);

  const lastMetaRef = React.useRef(null);

  const { streaming, streamedText, start } = useStreamingText({
    onPathStep,
    onDone: (fullText) => onDone(fullText, lastMetaRef.current),
  });

  const handleAsk = async (query) => {
    if (!query.trim() || streaming || asking) return;
    setMessages((prev) => [...prev, { role: "user", text: query }]);
    graph.setActivePath([]);
    graph.setActiveNode(null);
    setAsking(true);

    try {
      const answer = await askCopilot(query, sessionId);
      lastMetaRef.current = answer;
      if (answer.metadata?.sessionId) {
        setSessionId(answer.metadata.sessionId);
      }
      start(answer.text, heroPath);
    } catch (err) {
      const message =
        err.response?.status === 502 || err.response?.status === 504
          ? "The AI engine is unreachable right now. Please try again in a moment."
          : err.response?.data?.message || "Something went wrong answering that question.";
      setMessages((prev) => [...prev, { role: "ai", text: message, isError: true }]);
      toast({ type: "error", message });
    } finally {
      setAsking(false);
    }
  };

  useEffect(() => {
    if (pendingQuery) {
      handleAsk(pendingQuery);
      onConsumePendingQuery?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingQuery]);

  // The only place a session is reset - explicit user action, not an
  // implicit side effect of asking a question.
  const handleNewChat = useCallback(() => {
    setSessionId(null);
    setMessages([]);
    lastMetaRef.current = null;
    getInitialMessage().then((msg) => setMessages([msg]));
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4" style={{ height: "calc(100vh - 120px)" }}>
      <ChatWindow
        messages={messages}
        streaming={streaming}
        streamedText={streamedText}
        asking={asking}
        onAsk={handleAsk}
        onNewChat={handleNewChat}
        suggestedQueries={suggestedQueries}
        onSourceClick={onSearchDocuments}
      />
      <KnowledgeGraphPanel activePath={[]} activeNode={null} setActiveNode={graph.setActiveNode} />
    </div>
  );
}
