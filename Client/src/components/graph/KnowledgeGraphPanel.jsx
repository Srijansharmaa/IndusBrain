import React, { useState } from "react";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import IconButton from "../common/IconButton";
import GraphLegend from "./GraphLegend";
import NodeDetailCard from "./NodeDetailCard";
import { GRAPH_NODES, GRAPH_EDGES, findNodeById } from "../../constants/graphData";
import { NODE_TYPE_HEX } from "../../constants/colors";

export default function KnowledgeGraphPanel({ activePath = [], activeNode, setActiveNode, onExpand }) {
  const [zoom, setZoom] = useState(1);
  const pathSet = new Set(activePath);
  const isActive = (id) => pathSet.size === 0 || pathSet.has(id);
  const selectedNode = findNodeById(activeNode);

  return (
    <div className="flex flex-col h-full bg-navy rounded-card overflow-hidden border border-navy-line">
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-navy-line">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success shadow-[0_0_0_3px_rgba(34,197,94,0.2)]" />
          <span className="text-[12.5px] font-bold text-slate-200 tracking-wide">Live Knowledge Graph</span>
        </div>
        <div className="flex gap-1.5">
          <IconButton dark onClick={() => setZoom((z) => Math.min(1.6, z + 0.2))}>
            <ZoomIn size={13} className="text-slate-400" />
          </IconButton>
          <IconButton dark onClick={() => setZoom((z) => Math.max(0.6, z - 0.2))}>
            <ZoomOut size={13} className="text-slate-400" />
          </IconButton>
          {onExpand && (
            <IconButton dark onClick={onExpand}>
              <Maximize2 size={13} className="text-slate-400" />
            </IconButton>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <svg
          viewBox="0 0 850 400"
          className="w-full h-full transition-transform duration-300"
          style={{ transform: `scale(${zoom})` }}
        >
          {GRAPH_EDGES.map(([a, b], i) => {
            const nodeA = GRAPH_NODES.find((n) => n.id === a);
            const nodeB = GRAPH_NODES.find((n) => n.id === b);
            const active = pathSet.has(a) && pathSet.has(b);
            return (
              <line
                key={i}
                x1={nodeA.x} y1={nodeA.y} x2={nodeB.x} y2={nodeB.y}
                stroke={active ? "#2563EB" : "#1E293B"}
                strokeWidth={active ? 2.5 : 1.4}
                className="transition-all duration-400"
              />
            );
          })}
          {GRAPH_NODES.map((node) => {
            const color = NODE_TYPE_HEX[node.type];
            const active = isActive(node.id);
            const selected = activeNode === node.id;
            return (
              <g key={node.id} onClick={() => setActiveNode(node.id)} className="cursor-pointer">
                <circle
                  cx={node.x} cy={node.y} r={selected ? 15 : 10.5}
                  fill={active ? color : "#1E293B"}
                  stroke={selected ? "#fff" : "none"}
                  strokeWidth={2}
                  opacity={active ? 1 : 0.45}
                  className="transition-all duration-300"
                />
                <text
                  x={node.x} y={node.y + 24} textAnchor="middle" fontSize={9.5}
                  fill={active ? "#E2E8F0" : "#475569"}
                  fontFamily="Inter, sans-serif"
                  fontWeight={selected ? 700 : 500}
                  className="transition-colors duration-300"
                >
                  {node.label.length > 20 ? node.label.slice(0, 18) + "\u2026" : node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="px-4 pt-2.5 pb-3.5 border-t border-navy-line">
        <div className={`flex flex-wrap gap-2 ${activeNode ? "mb-2.5" : ""}`}>
          <GraphLegend />
        </div>
        {selectedNode && <NodeDetailCard node={selectedNode} />}
      </div>
    </div>
  );
}
