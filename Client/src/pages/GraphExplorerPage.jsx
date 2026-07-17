import React, { useState } from "react";
import { Share2 } from "lucide-react";
import KnowledgeGraphPanel from "../components/graph/KnowledgeGraphPanel";
import GraphFilterBar from "../components/graph/GraphFilterBar";
import GraphNodeDrawer from "../components/graph/GraphNodeDrawer";
import { GRAPH_NODES, findNodeById } from "../constants/graphData";

export default function GraphExplorerPage({ graph }) {
  const [filter, setFilter] = useState("all");
  const activeNode = findNodeById(graph.activeNode);
  const activePath = filter === "all" ? [] : GRAPH_NODES.filter((n) => n.type === filter).map((n) => n.id);

  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: activeNode ? "1fr 320px" : "1fr" }}>
      <div className="bg-card rounded-card border border-hairline overflow-hidden">
        <div className="px-5 py-4 border-b border-hairline flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 size={17} className="text-primary" />
            <span className="font-bold text-[14.5px] text-ink">Knowledge Graph Explorer</span>
          </div>
          <GraphFilterBar activeFilter={filter} onChange={setFilter} />
        </div>
        <div className="h-[560px]">
          <KnowledgeGraphPanel activePath={activePath} activeNode={graph.activeNode} setActiveNode={graph.setActiveNode} />
        </div>
      </div>
      {activeNode && (
        <GraphNodeDrawer
          node={activeNode}
          onClose={() => graph.setActiveNode(null)}
          onSelectRelated={graph.setActiveNode}
        />
      )}
    </div>
  );
}
