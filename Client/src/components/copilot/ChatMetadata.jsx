import React from "react";
import { FileText, ShieldAlert, ShieldCheck } from "lucide-react";
import Badge from "../common/Badge";

export default function ChatMetadata({ meta, onSourceClick }) {
  const hasSources = meta.sources?.length > 0;

  return (
    <div className="mt-5 rounded-2xl border border-indigo-100 bg-gradient-to-br from-slate-50 to-indigo-50 p-4">
      {/* Grounding indicator - reflects the real source count, not a fabricated confidence score */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-indigo-700">
          Evidence
        </p>

        {hasSources ? (
          <Badge tone="success">
            <ShieldCheck size={12} className="mr-1" />
            Grounded in {meta.sources.length} source{meta.sources.length > 1 ? "s" : ""}
          </Badge>
        ) : (
          <Badge tone="warning">
            <ShieldAlert size={12} className="mr-1" />
            No matching sources found
          </Badge>
        )}
      </div>

      {/* Sources */}
      {hasSources && (
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-indigo-700">
            Source Documents
          </p>

          <div className="flex flex-wrap gap-2">
            {meta.sources.map((source) => (
              <button
                key={source}
                onClick={() => onSourceClick?.(source)}
                className="flex items-center gap-2 rounded-lg border bg-white
border-indigo-100
hover:border-indigo-300
hover:bg-indigo-50
transition-all
cursor-pointer px-3 py-2 text-xs shadow-sm"
              >
                <FileText
                  size={14}
                  className="text-violet-600 "
                />

                <span className="font-medium text-slate-700">
                  {source}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}