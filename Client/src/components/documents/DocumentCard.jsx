import React, { useState } from "react";
import {
  FileText,
  BrainCircuit,
  Clock3,
  ArrowRight,
  MoreVertical,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { reprocessDocument, deleteDocument } from "../../services/documentService";
import { useToast } from "../common/Toast";

const STATUS_CONFIG = {
  completed: { label: "AI Ready", dotClass: "bg-emerald-500", textClass: "text-emerald-600" },
  processing: { label: "Processing", dotClass: "bg-amber-500 animate-pulse", textClass: "text-amber-600" },
  failed: { label: "Failed", dotClass: "bg-red-500", textClass: "text-red-600" },
};

export default function DocumentCard({ document, onOpen, onStatusChange, onDeleted }) {
  const status = STATUS_CONFIG[document.status] || STATUS_CONFIG.completed;
  const toast = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleRetry = async (e) => {
    e.stopPropagation();
    try {
      const result = await reprocessDocument(document._id);
      onStatusChange?.(result.document);
      toast({ type: "success", message: "Document reprocessed successfully." });
    } catch (err) {
      toast({ type: "error", message: `Retry failed: ${err.response?.data?.message || err.message}` });
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    if (!window.confirm(`Delete "${document.originalName}"? This can't be undone.`)) return;
    setDeleting(true);
    try {
      await deleteDocument(document._id);
      toast({ type: "success", message: "Document deleted." });
      onDeleted?.(document._id);
    } catch (err) {
      toast({ type: "error", message: `Delete failed: ${err.response?.data?.message || err.message}` });
      setDeleting(false);
    }
  };

  return (
    <div className={`group flex h-[390px] flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl ${deleting ? "opacity-40 pointer-events-none" : ""}`}>

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

        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((o) => !o);
            }}
            className="rounded-lg p-2 transition hover:bg-slate-100"
          >
            <MoreVertical size={18} className="text-slate-500" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full z-20 mt-1 w-40 rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                <button
                  onClick={handleDelete}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </>
          )}
        </div>

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

        <div className={`flex items-center gap-2 ${status.textClass}`}>
          <span className={`h-2 w-2 rounded-full ${status.dotClass}`} />
          {status.label}
        </div>

        <div className="flex items-center gap-1 text-slate-500">
          <Clock3 size={15} />
          {document.createdAt ? new Date(document.createdAt).toLocaleDateString() : "—"}
        </div>

      </div>

      {document.status === "failed" && (
        <p className="mt-2 text-xs text-red-500 line-clamp-2" title={document.statusMessage}>
          {document.statusMessage || "AI processing failed."}
        </p>
      )}

      {/* Divider */}

      <div className="my-5 border-t border-slate-100" />

      {/* Footer */}

      <div className="flex items-center justify-between">

        <button
          onClick={() => onOpen(document)}
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          View details
        </button>

        {document.status === "failed" ? (
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 text-sm font-semibold text-red-600 transition-all"
          >
            <RefreshCw size={16} />
            Retry
          </button>
        ) : (
          <button
            onClick={() => onOpen(document)}
            className="flex items-center gap-2 text-sm font-semibold text-blue-600 transition-all group-hover:gap-3"
          >
            AI Insights
            <ArrowRight size={16} />
          </button>
        )}

      </div>

    </div>
  );
}