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

  const relationCount = GRAPH_EDGES.filter(
    ([a, b]) => a === node.id || b === node.id
  ).length;

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            {node.label}
          </h3>

          <p className="text-xs text-gray-500 mt-1">
            Selected Knowledge Graph Node
          </p>
        </div>

        <Badge tone={TONE_BY_TYPE[node.type]}>
          {style.label}
        </Badge>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-gray-50 border border-gray-200 p-3">
          <p className="text-xs text-gray-500">
            Relationships
          </p>

          <p className="text-xl font-bold text-indigo-600">
            {relationCount}
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 border border-gray-200 p-3">
          <p className="text-xs text-gray-500">
            Type
          </p>

          <p className="text-sm font-semibold text-gray-800">
            {style.label}
          </p>
        </div>
      </div>
    </div>
  );
}