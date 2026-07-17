import React from "react";
import Badge from "../common/Badge";
import { NODE_TYPE_STYLES } from "../../constants/colors";
import { GRAPH_EDGES } from "../../constants/graphData";

const TONE_BY_TYPE = {
  equipment: "primary",
  incident: "danger",
  document: "warning",
  person: "purple",
  recommendation: "success",
};

export default function NodeDetailCard({ node }) {
  if (!node) return null;
  const style = NODE_TYPE_STYLES[node.type];
  const relationCount = GRAPH_EDGES.filter(([a, b]) => a === node.id || b === node.id).length;

  return (
    <div className="bg-navy-soft rounded-xl p-3 border border-navy-line">
      <div className="flex items-center justify-between">
        <span className="text-[12.5px] font-bold text-slate-100">{node.label}</span>
        <Badge tone={TONE_BY_TYPE[node.type]}>{style.label}</Badge>
      </div>
      <p className="mt-1.5 mb-0 text-[11.5px] text-slate-400 leading-relaxed">
        Connected to {relationCount} related nodes across the knowledge graph.
      </p>
    </div>
  );
}
