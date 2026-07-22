import React from "react";
import {
  FileText,
  BrainCircuit,
  Clock3,
  ArrowRight,
  MoreVertical,
} from "lucide-react";

export default function DocumentCard({ document, onOpen }) {
  return (
    <div className="group flex h-[390px] flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl">

      {/* Header */}
      <div className="flex items-start justify-between">

        <div className="flex items-center gap-3 min-w-0">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">
            <FileText size={22} className="text-blue-600" />
          </div>

          <div className="min-w-0">
            <h3
              className="truncate text-base font-semibold text-slate-900"
              title={document.originalName}
            >
              {document.originalName}
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              PDF Document
            </p>
          </div>

        </div>

        <button className="rounded-lg p-2 transition hover:bg-slate-100">
          <MoreVertical size={18} className="text-slate-500" />
        </button>

      </div>

      {/* Divider */}

      <div className="my-5 border-t border-slate-100" />

      {/* Summary */}

      <div className="flex-1">

        <h4 className="mb-2 text-sm font-semibold text-slate-800">
          AI Summary
        </h4>

        <p className="line-clamp-4 text-sm leading-6 text-slate-500">
          {document.summary ??
            "AI analyzed this document and extracted semantic knowledge for enterprise search and reasoning."}
        </p>

      </div>

      {/* Metadata */}

      <div className="mt-5 flex items-center justify-between text-sm">

        <div className="flex items-center gap-2 text-blue-600">
          <BrainCircuit size={16} />
          <span>{document.chunkCount ?? 0} Chunks</span>
        </div>

        <div className="flex items-center gap-2 text-emerald-600">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          AI Ready
        </div>

        <div className="flex items-center gap-1 text-slate-500">
          <Clock3 size={15} />
          Today
        </div>

      </div>

      {/* Divider */}

      <div className="my-5 border-t border-slate-100" />

      {/* Footer */}

      <div className="flex items-center justify-between">

        <button
          onClick={() => onOpen(document)}
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Open
        </button>

        <button className="flex items-center gap-2 text-sm font-semibold text-blue-600 transition-all group-hover:gap-3">
          AI Insights
          <ArrowRight size={16} />
        </button>

      </div>

    </div>
  );
}