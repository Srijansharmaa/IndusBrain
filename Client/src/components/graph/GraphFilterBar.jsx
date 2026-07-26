import React from "react";
import { cx } from "../../utils/classNames";

/**
 * Filter chips are derived from `types`, the distinct entity types
 * actually present in the live knowledge graph (as extracted by the AI
 * Engine - see ai_engine/knowledge_graph/knowledge_extractor.py), not a
 * fixed guess at what the graph might contain. "All" is always available.
 */
export default function GraphFilterBar({ types = [], activeFilter, onChange }) {
  const filters = ["all", ...types];

  return (
    <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl flex-wrap">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onChange(filter)}
          className={cx(
            "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 capitalize",
            activeFilter === filter
              ? "bg-indigo-600 text-white shadow-md"
              : "text-gray-600 hover:bg-white hover:text-gray-900"
          )}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}