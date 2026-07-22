import React from "react";
import { FileText, CheckCircle2, ShieldCheck } from "lucide-react";
import Badge from "../common/Badge";

export default function ChatMetadata({ meta }) {
  return (
    <div className="mt-5 rounded-2xl border border-indigo-100 bg-gradient-to-br from-slate-50 to-indigo-50 p-4">
      {/* Confidence */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-indigo-700">
          AI Confidence
        </p>

        <Badge tone="success">
          <ShieldCheck size={12} className="mr-1" />
          {meta.confidence}% Reliable
        </Badge>
      </div>

      {/* Sources */}
      <div className="mb-5">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-indigo-700">
          Sources
        </p>

        <div className="flex flex-wrap gap-2">
          {meta.sources.map((source) => (
            <div
              key={source}
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
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Actions */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Recommended Actions
        </p>

        <div className="space-y-2">
          {meta.actions.map((action) => (
            <div
              key={action}
              className="flex items-center gap-3 rounded-lg bg-gradient-to-r
from-white
to-emerald-50 p-3 border border-emerald-100"
            >
              <CheckCircle2
                size={18}
                className="text-emerald-500 shrink-0"
              />

              <span className="text-sm text-slate-700">
                {action}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}