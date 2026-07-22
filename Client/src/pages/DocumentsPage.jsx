import React, { useEffect, useState } from "react";
import DocumentFilters from "../components/documents/DocumentFilters";
import DocumentCard from "../components/documents/DocumentCard";
import SearchResults from "../components/documents/SearchResults";
import { getDocuments, getDocumentCategories, uploadDocument, semanticSearch,} from "../services/documentService";

export default function DocumentsPage({searchQuery}) {
  const [documents, setDocuments] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getDocuments().then(setDocuments);
    getDocumentCategories().then(setCategories);
  }, []);

  const filtered = activeCategory === "All" ? documents : documents.filter((d) => d.cat === activeCategory);

 const handleUpload = async (file) => {
  try {
    const result = await uploadDocument(file);

    console.log(result);

    alert(`Successfully processed ${result.aiResult.total_chunks} chunks`);

    // Refresh the document list
    const docs = await getDocuments();
    setDocuments(docs);

  } catch (err) {
    console.error(err);
    alert("Upload failed. Please try again.");
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
  <SearchResults
    query={searchQuery}
    results={searchResults}
    loading={loading}
  />
) : (
  <div className="grid grid-cols-3 gap-4">
    {filtered.map((document) => (
      <DocumentCard
        key={document.filename}
        document={document}
        onOpen={() => {}}
      />
    ))}
  </div>
)}
    </div>
  );
}
