import React, { useEffect, useState } from "react";
import { FileText, BrainCircuit, Clock3, HardDrive } from "lucide-react";
import Modal from "../common/Modal";
import LoadingSpinner from "../common/LoadingSpinner";
import { getDocumentById } from "../../services/documentService";

const formatBytes = (bytes) => {
  if (!bytes) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(1)} ${units[i]}`;
};

export default function DocumentDetailModal({ documentId, onClose }) {
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getDocumentById(documentId)
      .then((d) => !cancelled && setDoc(d))
      .catch(() => !cancelled && setError("Couldn't load this document."))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [documentId]);

  return (
    <Modal title={doc?.originalName || "Document"} onClose={onClose}>
      {loading && (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      )}

      {!loading && error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && doc && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-surface border border-hairline p-3 text-center">
              <BrainCircuit size={16} className="mx-auto text-primary" />
              <p className="mt-1.5 text-sm font-bold text-ink">{doc.chunkCount ?? 0}</p>
              <p className="text-[10.5px] text-subtext uppercase">Chunks</p>
            </div>
            <div className="rounded-xl bg-surface border border-hairline p-3 text-center">
              <HardDrive size={16} className="mx-auto text-primary" />
              <p className="mt-1.5 text-sm font-bold text-ink">{formatBytes(doc.fileSize)}</p>
              <p className="text-[10.5px] text-subtext uppercase">Size</p>
            </div>
            <div className="rounded-xl bg-surface border border-hairline p-3 text-center">
              <Clock3 size={16} className="mx-auto text-primary" />
              <p className="mt-1.5 text-sm font-bold text-ink">
                {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : "—"}
              </p>
              <p className="text-[10.5px] text-subtext uppercase">Uploaded</p>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-subtext mb-1">Status</p>
            <p className="text-sm text-ink capitalize">{doc.status}</p>
            {doc.status === "failed" && doc.statusMessage && (
              <p className="mt-1 text-xs text-red-500">{doc.statusMessage}</p>
            )}
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-subtext mb-1">File type</p>
            <p className="text-sm text-ink">{doc.fileType || "—"}</p>
          </div>

          {doc.analysis && Object.keys(doc.analysis).length > 0 && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-subtext mb-1">AI Analysis</p>
              <pre className="rounded-xl bg-surface border border-hairline p-3 text-xs text-ink overflow-x-auto max-h-48">
                {JSON.stringify(doc.analysis, null, 2)}
              </pre>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-subtext pt-1">
            <FileText size={13} />
            Stored server-side; full-text search is available from the top search bar.
          </div>
        </div>
      )}
    </Modal>
  );
}
