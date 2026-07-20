import React from "react";
import {
  X,
  ChevronRight,
  FileText,
  User,
  Cog,
  TriangleAlert,
  Lightbulb,
} from "lucide-react";
import { NODE_TYPE_STYLES } from "../../constants/colors";
import { findRelatedNodeIds, findNodeById } from "../../constants/graphData";

const ICONS = {
  equipment: Cog,
  incident: TriangleAlert,
  document: FileText,
  person: User,
  recommendation: Lightbulb,
};

export default function GraphNodeDrawer({
  node,
  onClose,
  onSelectRelated,
}) {
  if (!node) return null;

  const relatedIds = findRelatedNodeIds(node.id);
  const Icon = ICONS[node.type];

  return (
    <div className="w-full h-full rounded-2xl border border-gray-200 bg-white shadow-lg flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
            <Icon className="text-indigo-600" size={18} />
          </div>

          <div>
            <h2 className="font-semibold text-gray-900">
              {node.label}
            </h2>

            <p className="text-xs text-gray-500 capitalize">
              {node.type}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="rounded-lg p-2 hover:bg-gray-100 transition"
        >
          <X size={18} />
        </button>
      </div>

      {/* Summary */}
      <div className="p-5">
        <h3 className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
          AI Summary
        </h3>

        <p className="mt-2 text-sm leading-7 text-gray-700">
          This node has{" "}
          <span className="font-semibold text-indigo-600">
            {relatedIds.length}
          </span>{" "}
          direct relationships within the enterprise knowledge graph,
          connecting assets, incidents, supporting documents and people.
        </p>
      </div>

      {/* Statistics */}
      <div className="px-5">
        <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
          <div className="flex justify-between">
            <span className="text-gray-500 text-sm">
              Relationships
            </span>

            <span className="font-semibold">
              {relatedIds.length}
            </span>
          </div>

          <div className="flex justify-between mt-3">
            <span className="text-gray-500 text-sm">
              Node ID
            </span>

            <span className="font-mono text-sm">
              {node.id}
            </span>
          </div>
        </div>
      </div>

      {/* Related Nodes */}
      <div className="flex-1 p-5 overflow-y-auto">
        <h3 className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-3">
          Connected Nodes
        </h3>

        <div className="space-y-2">
          {relatedIds.map((id) => {
            const related = findNodeById(id);
            if (!related) return null;

            return (
              <button
                key={id}
                onClick={() => onSelectRelated(id)}
                className="w-full flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-3 h-3 rounded-full ${NODE_TYPE_STYLES[related.type].dot}`}
                  />

                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {related.label}
                    </p>

                    <p className="text-xs text-gray-500 capitalize">
                      {related.type}
                    </p>
                  </div>
                </div>

                <ChevronRight size={16} className="text-gray-400" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}