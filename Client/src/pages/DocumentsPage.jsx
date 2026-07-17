import React, { useEffect, useState } from "react";
import DocumentFilters from "../components/documents/DocumentFilters";
import DocumentCard from "../components/documents/DocumentCard";
import { getDocuments, getDocumentCategories, uploadDocument } from "../services/documentService";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    getDocuments().then(setDocuments);
    getDocumentCategories().then(setCategories);
  }, []);

  const filtered = activeCategory === "All" ? documents : documents.filter((d) => d.cat === activeCategory);

  return (
    <div>
      <DocumentFilters
        categories={categories}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
        onUpload={() => uploadDocument(null)}
      />
      <div className="grid grid-cols-3 gap-4">
        {filtered.map((document) => (
          <DocumentCard key={document.id} document={document} onOpen={() => {}} />
        ))}
      </div>
    </div>
  );
}
