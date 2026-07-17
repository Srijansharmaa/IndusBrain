import React, { useEffect, useState, useCallback } from "react";
import ChatWindow from "../components/copilot/ChatWindow";
import KnowledgeGraphPanel from "../components/graph/KnowledgeGraphPanel";
import { useStreamingText } from "../hooks/useStreamingText";
import { askCopilot, getInitialMessage, getSuggestedQueries } from "../services/copilotService";
import { HERO_PATH } from "../constants/graphData";

export default function CopilotPage({ graph }) {
  const [messages, setMessages] = useState([]);
  const [suggestedQueries, setSuggestedQueries] = useState([]);

  useEffect(() => {
    getInitialMessage().then((msg) => setMessages([msg]));
    getSuggestedQueries().then(setSuggestedQueries);
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
    if (!query.trim() || streaming) return;
    setMessages((prev) => [...prev, { role: "user", text: query }]);
    graph.setActivePath([]);
    graph.setActiveNode(null);

    const answer = await askCopilot(query);
    lastMetaRef.current = answer;
    start(answer.text, HERO_PATH);
  };

  return (
    <div className="grid grid-cols-[1.6fr_1fr] gap-4" style={{ height: "calc(100vh - 120px)" }}>
      <ChatWindow
        messages={messages}
        streaming={streaming}
        streamedText={streamedText}
        onAsk={handleAsk}
        suggestedQueries={suggestedQueries}
      />
      <KnowledgeGraphPanel activePath={[]} activeNode={null} setActiveNode={graph.setActiveNode} />
    </div>
  );
}
