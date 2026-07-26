import React, { memo, useEffect, useRef, useState } from "react";
import { ZoomIn, ZoomOut, Maximize2, RotateCcw } from "lucide-react";
import IconButton from "../common/IconButton";
import GraphLegend from "./GraphLegend";
import NodeDetailCard from "./NodeDetailCard";
import LoadingSpinner from "../common/LoadingSpinner";
import { getGraphNodes, getGraphEdges } from "../../services/graphService";
import { getNodeTypeHex } from "../../constants/colors";
import { useForceGraphLayout } from "../../hooks/useForceGraphLayout";
import { SELECTED_RADIUS_BONUS, HOVER_RADIUS_BONUS } from "../../utils/forceGraphLayout";

/**
 * A single node, memoized so hover/hover-out on one node doesn't force a
 * re-render of every other node in the graph. Position is NOT a React
 * prop - it's written directly to the DOM by useForceGraphLayout on every
 * simulation tick - only the visual state (color/active/selected/hover)
 * is React-driven here.
 */
const GraphNodeView = memo(function GraphNodeView({
  node,
  registerNodeEl,
  active,
  selected,
  hovered,
  onSelect,
  onHoverStart,
  onHoverEnd,
  onDragStart,
  onDragEnd,
}) {
  const color = getNodeTypeHex(node.type);
  const baseRadius = node.radius;
  const radius = selected ? baseRadius + SELECTED_RADIUS_BONUS : hovered ? baseRadius + HOVER_RADIUS_BONUS : baseRadius;

  return (
    <g
      ref={(el) => registerNodeEl(node.id, el)}
      transform={`translate(${node.x},${node.y})`}
      onClick={() => onSelect(node.id)}
      onPointerDown={(e) => onDragStart(e, node.id)}
      onPointerUp={onDragEnd}
      onPointerEnter={() => onHoverStart(node.id)}
      onPointerLeave={() => onHoverEnd(node.id)}
      className="cursor-pointer"
    >
      <circle
        r={radius}
        fill={active ? color : "#1E293B"}
        stroke={selected ? "#1E293B" : hovered ? color : "none"}
        strokeWidth={selected ? 2 : 1.5}
        opacity={active ? 1 : 0.3}
        className="transition-[opacity,stroke] duration-200"
      />
      <text
        y={radius + 13.5}
        textAnchor="middle"
        fontSize={9.5}
        fill="#334155"
        fontFamily="Inter, sans-serif"
        fontWeight={selected ? 700 : 500}
        opacity={active ? 1 : 0.4}
        className="transition-opacity duration-200 select-none"
      >
        {node.label.length > 20 ? node.label.slice(0, 18) + "\u2026" : node.label}
      </text>
    </g>
  );
});

const GraphEdgeView = memo(function GraphEdgeView({ index, registerEdgeEl, sourceX, sourceY, targetX, targetY, active }) {
  return (
    <line
      ref={(el) => registerEdgeEl(index, el)}
      x1={sourceX}
      y1={sourceY}
      x2={targetX}
      y2={targetY}
      stroke={active ? "#4F46E5" : "#CBD5E1"}
      strokeWidth={active ? 2.5 : 1.4}
      className="transition-[stroke] duration-200"
    />
  );
});

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
  const [error, setError] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [bounds, setBounds] = useState({ width: 850, height: 400 });
  const dragRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    setError(null);
    Promise.all([getGraphNodes(), getGraphEdges()])
      .then(([n, e]) => {
        setNodes(n || []);
        setEdges(e || []);
      })
      .catch(() => setError("Couldn't load the knowledge graph. The AI engine may be unreachable."))
      .finally(() => setLoading(false));
  }, []);

  // Adapt to window/container resizing and re-center the layout, rather
  // than stretching a fixed-size viewBox to fit.
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) {
        setBounds((prev) => (Math.abs(prev.width - width) > 4 || Math.abs(prev.height - height) > 4 ? { width, height } : prev));
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Positions computed entirely on the frontend via a d3-force simulation
  // - the backend's node.x/node.y (from its deterministic layout) are
  // intentionally ignored here. Nodes/edges data (id/type/label,
  // source/target ids) still come straight from the existing Graph API.
  const { simNodes, simEdges, registerNodeEl, registerEdgeEl, beginDrag, dragTo, endDrag, isSettling } =
    useForceGraphLayout(nodes, edges, bounds);

  const pathSet = new Set(activePath);
  const query = searchQuery.trim().toLowerCase();
  const matchesSearch = (node) => !query || node?.label?.toLowerCase().includes(query);

  // Direct neighbors of the selected node, so clicking a node highlights its
  // real relationships rather than only lighting up along a preset path.
  const neighborIds = new Set();
  if (activeNode && pathSet.size === 0) {
    neighborIds.add(activeNode);
    simEdges.forEach((e) => {
      const sourceId = typeof e.source === "object" ? e.source.id : e.source;
      const targetId = typeof e.target === "object" ? e.target.id : e.target;
      if (sourceId === activeNode) neighborIds.add(targetId);
      if (targetId === activeNode) neighborIds.add(sourceId);
    });
  }
  const highlightSet = neighborIds.size > 0 ? neighborIds : pathSet;

  const isActive = (node) =>
    highlightSet.size === 0 ? matchesSearch(node) : highlightSet.has(node.id) && matchesSearch(node);
  const selectedNode = simNodes.find((n) => n.id === activeNode);

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

  const onNodeDragStart = (e, nodeId) => {
    e.stopPropagation(); // don't also trigger background pan
    e.currentTarget.setPointerCapture(e.pointerId);
    beginDrag(nodeId, e.clientX, e.clientY);
  };
  const onNodeDragMove = (e) => dragTo(e.clientX, e.clientY, zoom);
  const onNodeDragEnd = (e) => {
    e.stopPropagation();
    endDrag();
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
        ref={containerRef}
        className="flex-1 overflow-hidden relative bg-slate-50"
        style={{ cursor: dragRef.current ? "grabbing" : "grab" }}
        onPointerDown={onPointerDown}
        onPointerMove={(e) => {
          onPointerMove(e);
          onNodeDragMove(e);
        }}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="flex h-full items-center justify-center px-6 text-center">
            <p className="text-sm text-red-500 font-medium">{error}</p>
          </div>
        ) : simNodes.length === 0 ? (
          <div className="flex h-full items-center justify-center px-6 text-center">
            <p className="text-sm text-gray-500">
              No knowledge graph yet. Upload and process a document to get started.
            </p>
          </div>
        ) : (
        <svg
          viewBox={`0 0 ${bounds.width} ${bounds.height}`}
          className="w-full h-full select-none"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transition: dragRef.current ? "none" : "transform 0.25s ease-out",
          }}
        >
          {simEdges.map((e, i) => {
            const source = typeof e.source === "object" ? e.source : simNodes.find((n) => n.id === e.source);
            const target = typeof e.target === "object" ? e.target : simNodes.find((n) => n.id === e.target);
            if (!source || !target) return null;
            const active = highlightSet.size > 0 ? highlightSet.has(source.id) && highlightSet.has(target.id) : true;
            return (
              <GraphEdgeView
                key={i}
                index={i}
                registerEdgeEl={registerEdgeEl}
                sourceX={source.x}
                sourceY={source.y}
                targetX={target.x}
                targetY={target.y}
                active={active}
              />
            );
          })}
          {simNodes.map((node) => (
            <GraphNodeView
              key={node.id}
              node={node}
              registerNodeEl={registerNodeEl}
              active={isActive(node)}
              selected={activeNode === node.id}
              hovered={hoveredNode === node.id}
              onSelect={setActiveNode}
              onHoverStart={setHoveredNode}
              onHoverEnd={() => setHoveredNode((h) => (h === node.id ? null : h))}
              onDragStart={onNodeDragStart}
              onDragEnd={onNodeDragEnd}
            />
          ))}
        </svg>
        )}
        {!loading && !error && simNodes.length > 0 && isSettling && (
          <span className="absolute bottom-3 right-3 rounded-full bg-white/90 border border-gray-200 px-2.5 py-1 text-[10.5px] font-medium text-gray-500 shadow-sm">
            Arranging layout…
          </span>
        )}
      </div>

      <div className="px-4 pt-2.5 pb-3.5 border-t border-gray-200 bg-white">
        <div className={`flex flex-wrap gap-2 ${activeNode ? "mb-2.5" : ""}`}>
          <GraphLegend />
        </div>
        {selectedNode && (
          <NodeDetailCard
            node={selectedNode}
            relationCount={
              simEdges.filter((e) => {
                const sourceId = typeof e.source === "object" ? e.source.id : e.source;
                const targetId = typeof e.target === "object" ? e.target.id : e.target;
                return sourceId === selectedNode.id || targetId === selectedNode.id;
              }).length
            }
          />
        )}
      </div>
    </div>
  );
}
