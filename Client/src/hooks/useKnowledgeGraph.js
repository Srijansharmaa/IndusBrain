import { useState, useCallback } from "react";

/**
 * Shared state for the always-visible Knowledge Graph panel.
 * Any page can call `highlightPath` / `focusNode` to drive the
 * live graph without owning graph state itself.
 */
export function useKnowledgeGraph() {
  const [activePath, setActivePath] = useState([]);
  const [activeNode, setActiveNode] = useState(null);

  const highlightPath = useCallback((path) => setActivePath(path), []);
  const focusNode = useCallback((nodeId) => setActiveNode(nodeId), []);
  const clear = useCallback(() => {
    setActivePath([]);
    setActiveNode(null);
  }, []);

  return { activePath, activeNode, setActivePath, setActiveNode, highlightPath, focusNode, clear };
}
