import React, { useEffect, useState } from "react";
import { Share2, Search, X, ChevronRight } from "lucide-react";
import KnowledgeGraphPanel from "../components/graph/KnowledgeGraphPanel";
import GraphFilterBar from "../components/graph/GraphFilterBar";
import GraphNodeDrawer from "../components/graph/GraphNodeDrawer";
import { getGraphNodes, getNodeDetails } from "../services/graphService";

export default function GraphExplorerPage({ graph }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [nodes, setNodes] = useState([]);
  const [activeNode, setActiveNode] = useState(null);
  const [relatedNodes, setRelatedNodes] = useState([]);
  const [trail, setTrail] = useState([]);

  useEffect(() => {
    getGraphNodes().then(setNodes);
  }, []);

  useEffect(() => {
    if (!graph.activeNode) {
      setActiveNode(null);
      setRelatedNodes([]);
      return;
    }

    let cancelled = false;
    getNodeDetails(graph.activeNode).then(({ node, relatedIds }) => {
      if (cancelled) return;
      setActiveNode(node);
      setRelatedNodes(
        (relatedIds || [])
          .map((id) => nodes.find((n) => n.id === id))
          .filter(Boolean)
      );
      if (node) {
        setTrail((prev) => {
          const withoutDupe = prev.filter((n) => n.id !== node.id);
          return [...withoutDupe, { id: node.id, label: node.label }].slice(-6);
        });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [graph.activeNode, nodes]);

  const activePath =
    filter === "all"
      ? []
      : nodes.filter((n) => n.type === filter).map((n) => n.id);

  return (
    <div
      className="grid gap-5 grid-cols-1"
      style={{
        gridTemplateColumns: activeNode ? "minmax(0, 1fr) 340px" : "minmax(0, 1fr)",
      }}
    >
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">

        {/* Header */}
        <div className="px-6 py-4 bg-[#111827] border-b border-gray-700 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center shrink-0">
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

          <div className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 min-w-[180px]">
            <Search size={14} className="text-gray-400 shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search nodes..."
              className="bg-transparent border-none outline-none text-xs text-white placeholder:text-gray-400 w-full"
            />
            {search && (
              <button onClick={() => setSearch("")}>
                <X size={13} className="text-gray-400" />
              </button>
            )}
          </div>

          <GraphFilterBar
            activeFilter={filter}
            onChange={setFilter}
          />
        </div>

        {trail.length > 1 && (
          <div className="flex items-center gap-1 flex-wrap px-6 py-2 border-b border-gray-100 bg-slate-50 text-xs">
            {trail.map((n, i) => (
              <React.Fragment key={n.id}>
                {i > 0 && <ChevronRight size={11} className="text-slate-400" />}
                <button
                  onClick={() => graph.setActiveNode(n.id)}
                  className={`hover:underline ${i === trail.length - 1 ? "font-semibold text-ink" : "text-subtext"}`}
                >
                  {n.label}
                </button>
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Graph */}
        <div className="h-[560px] bg-[#F8FAFC]">
          <KnowledgeGraphPanel
            activePath={activePath}
            activeNode={graph.activeNode}
            setActiveNode={graph.setActiveNode}
            searchQuery={search}
          />
        </div>
      </div>

      {activeNode && (
        <GraphNodeDrawer
          node={activeNode}
          relatedNodes={relatedNodes}
          onClose={() => graph.setActiveNode(null)}
          onSelectRelated={graph.setActiveNode}
        />
      )}
    </div>
  );
}