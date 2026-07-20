import React, { useState } from "react";
import { Share2 } from "lucide-react";
import KnowledgeGraphPanel from "../components/graph/KnowledgeGraphPanel";
import GraphFilterBar from "../components/graph/GraphFilterBar";
import GraphNodeDrawer from "../components/graph/GraphNodeDrawer";
import { GRAPH_NODES, findNodeById } from "../constants/graphData";

export default function GraphExplorerPage({ graph }) {
  const [filter, setFilter] = useState("all");

  const activeNode = findNodeById(graph.activeNode);

  const activePath =
    filter === "all"
      ? []
      : GRAPH_NODES.filter((n) => n.type === filter).map((n) => n.id);

  return (
    <div
      className="grid gap-5"
      style={{
        gridTemplateColumns: activeNode ? "1fr 340px" : "1fr",
      }}
    >
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">

        {/* Header */}
        <div className="px-6 py-4 bg-[#111827] border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center">
              <Share2 size={18} className="text-white" />
            </div>

            <div>
              <h2 className="text-white font-bold text-base">
                Knowledge Graph
              </h2>

              <p className="text-gray-400 text-xs">
                Enterprise Relationship Explorer
              </p>
            </div>
          </div>

          <GraphFilterBar
            activeFilter={filter}
            onChange={setFilter}
          />
        </div>

        {/* Graph */}
        <div className="h-[560px] bg-[#F8FAFC]">
          <KnowledgeGraphPanel
            activePath={activePath}
            activeNode={graph.activeNode}
            setActiveNode={graph.setActiveNode}
          />
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