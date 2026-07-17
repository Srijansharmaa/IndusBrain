import React from "react";
import { NODE_TYPE_STYLES } from "../../constants/colors";

export default function GraphLegend() {
  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(NODE_TYPE_STYLES).map(([key, style]) => (
        <div key={key} className="flex items-center gap-1.5">
          <div className={`w-[7px] h-[7px] rounded-full ${style.dot}`} />
          <span className="text-[10.5px] text-slate-400">{style.label}</span>
        </div>
      ))}
    </div>
  );
}
