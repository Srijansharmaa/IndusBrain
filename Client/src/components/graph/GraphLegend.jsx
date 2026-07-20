import React from "react";
import { NODE_TYPE_STYLES } from "../../constants/colors";

export default function GraphLegend() {
  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(NODE_TYPE_STYLES).map(([key, style]) => (
        <div
          key={key}
          className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 shadow-sm transition-all hover:shadow-md"
        >
          <span className={`h-3 w-3 rounded-full ${style.dot}`} />
          <span className="text-xs font-medium text-gray-700">
            {style.label}
          </span>
        </div>
      ))}
    </div>
  );
}