import React from "react";
import { FileText, CheckCircle2 } from "lucide-react";
import Badge from "../common/Badge";

export default function ChatMetadata({ meta }) {
  return (
    <div className="mt-3 pt-3 border-t border-hairline">
      <div className="flex items-center gap-2 mb-2">
        <Badge tone="success">{meta.confidence}% confidence</Badge>
      </div>
      <p className="m-0 mb-1 text-[11px] font-bold text-subtext uppercase">Sources</p>
      <div className="flex flex-wrap gap-1.5 mb-2.5">
        {meta.sources.map((source) => (
          <span
            key={source}
            className="flex items-center gap-1 text-[11px] bg-white border border-hairline rounded-lg px-2 py-1"
          >
            <FileText size={11} className="text-primary" /> {source}
          </span>
        ))}
      </div>
      <p className="m-0 mb-1 text-[11px] font-bold text-subtext uppercase">Recommended actions</p>
      {meta.actions.map((action) => (
        <div key={action} className="flex items-center gap-1.5 text-xs py-1">
          <CheckCircle2 size={12} className="text-success shrink-0" /> {action}
        </div>
      ))}
    </div>
  );
}
