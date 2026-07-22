import React, { useEffect, useRef, useState } from "react";
import { ZoomIn, ZoomOut, Maximize2, RotateCcw } from "lucide-react";
import IconButton from "../common/IconButton";
import GraphLegend from "./GraphLegend";
import NodeDetailCard from "./NodeDetailCard";
import LoadingSpinner from "../common/LoadingSpinner";
import { getGraphNodes, getGraphEdges } from "../../services/graphService";
import { NODE_TYPE_HEX } from "../../constants/colors";

export default function KnowledgeGraphPanel({
  activePath = [],
  activeNode,
  setActiveNode,
  onExpand,
  searchQuery = "",
}) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [loading, setLoading] = useState(true);
  const dragRef = useRef(null);

  useEffect(() => {
    Promise.all([getGraphNodes(), getGraphEdges()])
      .then(([n, e]) => {
        setNodes(n || []);
        setEdges(e || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const pathSet = new Set(activePath);
  const query = searchQuery.trim().toLowerCase();
  const matchesSearch = (node) => !query || node.label.toLowerCase().includes(query);

  // Direct neighbors of the selected node, so clicking a node highlights its
  // real relationships rather than only lighting up along a preset path.
  const neighborIds = new Set();
  if (activeNode && pathSet.size === 0) {
    neighborIds.add(activeNode);
    edges.forEach(([a, b]) => {
      if (a === activeNode) neighborIds.add(b);
      if (b === activeNode) neighborIds.add(a);
    });
  }
  const highlightSet = neighborIds.size > 0 ? neighborIds : pathSet;

  const isActive = (id) => (highlightSet.size === 0 ? matchesSearch(nodes.find((n) => n.id === id)) : highlightSet.has(id) && matchesSearch(nodes.find((n) => n.id === id)));
  const selectedNode = nodes.find((n) => n.id === activeNode);

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const onPointerDown = (e) => {
    dragRef.current = { startX: e.clientX, startY: e.clientY, origin: pan };
  };
  const onPointerMove = (e) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setPan({ x: dragRef.current.origin.x + dx, y: dragRef.current.origin.y + dy });
  };
  const onPointerUp = () => {
    dragRef.current = null;
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
  <div>
    <h2 className="text-lg font-semibold text-gray-900">
      Knowledge Graph
    </h2>

    <p className="text-sm text-gray-500">
      Visualize relationships across enterprise entities
    </p>
  </div>

  <div className="flex gap-2">
    <IconButton
      onClick={() => setZoom((z) => Math.min(2.4, z + 0.2))}
      className="rounded-lg border border-gray-200 bg-white hover:bg-gray-50"
    >
      <ZoomIn size={16} className="text-gray-600" />
    </IconButton>

    <IconButton
      onClick={() => setZoom((z) => Math.max(0.5, z - 0.2))}
      className="rounded-lg border border-gray-200 bg-white hover:bg-gray-50"
    >
      <ZoomOut size={16} className="text-gray-600" />
    </IconButton>

    <IconButton
      onClick={resetView}
      title="Reset view"
      className="rounded-lg border border-gray-200 bg-white hover:bg-gray-50"
    >
      <RotateCcw size={15} className="text-gray-600" />
    </IconButton>

    {onExpand && (
      <IconButton
        onClick={onExpand}
        className="rounded-lg border border-gray-200 bg-white hover:bg-gray-50"
      >
        <Maximize2 size={16} className="text-gray-600" />
      </IconButton>
    )}
  </div>
</div>
      <div
        className="flex-1 overflow-hidden relative bg-slate-50"
        style={{ cursor: dragRef.current ? "grabbing" : "grab" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : (
        <svg
          viewBox="0 0 850 400"
          className="w-full h-full select-none"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transition: dragRef.current ? "none" : "transform 0.25s ease-out",
          }}
        >
          {edges.map(([a, b], i) => {
            const nodeA = nodes.find((n) => n.id === a);
            const nodeB = nodes.find((n) => n.id === b);
            if (!nodeA || !nodeB) return null;
            const active = highlightSet.size > 0 ? highlightSet.has(a) && highlightSet.has(b) : true;
            return (
              <line
                key={i}
                x1={nodeA.x} y1={nodeA.y} x2={nodeB.x} y2={nodeB.y}
                stroke={active ? "#4F46E5" : "#CBD5E1"}
                strokeWidth={active ? 2.5 : 1.4}
                className="transition-all duration-400"
              />
            );
          })}
          {nodes.map((node) => {
            const color = NODE_TYPE_HEX[node.type];
            const active = isActive(node.id);
            const selected = activeNode === node.id;
            return (
              <g key={node.id} onClick={() => setActiveNode(node.id)} className="cursor-pointer">
                <circle
                  cx={node.x} cy={node.y} r={selected ? 15 : 10.5}
                  fill={active ? color : "#1E293B"}
                  stroke={selected ? "#1E293B" : "none"}
                  strokeWidth={2}
                  opacity={active ? 1 : 0.3}
                  className="transition-all duration-300"
                />
                <text
                  x={node.x} y={node.y + 24} textAnchor="middle" fontSize={9.5}
                  fill="#334155"
                  fontFamily="Inter, sans-serif"
                  fontWeight={selected ? 700 : 500}
                  opacity={active ? 1 : 0.4}
                  className="transition-all duration-300"
                >
                  {node.label.length > 20 ? node.label.slice(0, 18) + "\u2026" : node.label}
                </text>
              </g>
            );
          })}
        </svg>
        )}
      </div>

      <div className="px-4 pt-2.5 pb-3.5 border-t border-gray-200 bg-white">
        <div className={`flex flex-wrap gap-2 ${activeNode ? "mb-2.5" : ""}`}>
          <GraphLegend />
        </div>
        {selectedNode && (
          <NodeDetailCard
            node={selectedNode}
            relationCount={edges.filter(([a, b]) => a === selectedNode.id || b === selectedNode.id).length}
          />
        )}
      </div>
    </div>
  );
}
