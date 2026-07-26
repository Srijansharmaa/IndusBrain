import React from "react";
import Badge from "../common/Badge";
import { getNodeTypeStyle, getNodeTypeBucket } from "../../constants/colors";

const TONE_BY_BUCKET = {
  equipment: "primary",
  material: "danger",
  document: "warning",
  person: "purple",
  process: "success",
  unknown: "neutral",
};

export default function NodeDetailCard({ node, relationCount = 0 }) {
  if (!node) return null;

  const style = getNodeTypeStyle(node.type);
  const tone = TONE_BY_BUCKET[getNodeTypeBucket(node.type)];

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

        <Badge tone={tone}>
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