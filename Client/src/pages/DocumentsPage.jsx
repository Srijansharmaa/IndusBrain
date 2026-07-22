import React, { useEffect, useState } from "react";
import { FileX } from "lucide-react";
import DocumentFilters from "../components/documents/DocumentFilters";
import DocumentCard from "../components/documents/DocumentCard";
import DocumentDetailModal from "../components/documents/DocumentDetailModal";
import SearchResults from "../components/documents/SearchResults";
import EmptyState from "../components/common/EmptyState";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useToast } from "../components/common/Toast";
import {
  getDocuments,
  getDocumentCategories,
  getExtension,
  uploadDocument,
  semanticSearch,
} from "../services/documentService";

export default function DocumentsPage({ searchQuery }) {
  const [documents, setDocuments] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [docsLoading, setDocsLoading] = useState(true);
  const [openDocumentId, setOpenDocumentId] = useState(null);
  const toast = useToast();

  const refresh = async () => {
    const docs = await getDocuments();
    setDocuments(docs);
    setCategories(await getDocumentCategories());
  };

  useEffect(() => {
    setDocsLoading(true);
    refresh().finally(() => setDocsLoading(false));
  }, []);

  const filtered =
    activeCategory === "All" ? documents : documents.filter((d) => getExtension(d) === activeCategory);

  const handleUpload = async (file) => {
    try {
      const result = await uploadDocument(file);

      if (result.document?.status === "failed") {
        toast({
          type: "error",
          message: `Uploaded, but AI processing failed: ${result.document.statusMessage || "unknown error"}. Retry from the document card.`,
        });
      } else {
        toast({
          type: "success",
          message: `Processed ${result.document?.chunkCount ?? result.aiResult?.total_chunks ?? 0} chunks successfully.`,
        });
      }

      await refresh();
    } catch (err) {
      toast({ type: "error", message: "Upload failed. Please try again." });
    }
  };

  useEffect(() => {
    if (!searchQuery?.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);

      try {
        const results = await semanticSearch(searchQuery);
        setSearchResults(results);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div>
      <DocumentFilters
        categories={categories}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
        onUpload={handleUpload}
      />
      {searchQuery?.trim() ? (
        <SearchResults query={searchQuery} results={searchResults} loading={loading} />
      ) : docsLoading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner size={28} />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FileX}
          title={documents.length === 0 ? "No documents yet" : "No documents in this category"}
          description={
            documents.length === 0
              ? "Upload a PDF, Word, Excel, or image file to get started."
              : "Try a different filter, or upload a new document."
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((document) => (
            <DocumentCard
              key={document._id}
              document={document}
              onOpen={(d) => setOpenDocumentId(d._id)}
              onStatusChange={(updated) =>
                setDocuments((docs) => docs.map((d) => (d._id === updated._id ? updated : d)))
              }
              onDeleted={(id) => setDocuments((docs) => docs.filter((d) => d._id !== id))}
            />
          ))}
        </div>
      )}

      {openDocumentId && (
        <DocumentDetailModal documentId={openDocumentId} onClose={() => setOpenDocumentId(null)} />
      )}
    </div>
  );
}
