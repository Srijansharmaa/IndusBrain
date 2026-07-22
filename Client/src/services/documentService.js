import axios from "axios";

import api from "./api";


export const getDocuments = async () => {
  const res = await api.get("/documents");
  return res.data.documents;
};

export const getDocumentById = async (id) => {
  const res = await api.get(`/documents/${id}`);
  return res.data.document;
};

export const deleteDocument = async (id) => {
  const res = await api.delete(`/documents/${id}`);
  return res.data;
};

export const getExtension = (doc) => {
  const match = /\.([a-z0-9]+)$/i.exec(doc.originalName || "");
  return match ? match[1].toUpperCase() : "Other";
};

export const getDocumentCategories = async () => {
  const docs = await getDocuments();

  const categories = [
    "All",
    ...new Set(docs.map(getExtension)),
  ];

  return categories;
};

export const uploadDocument = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post("/documents/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};
export const reprocessDocument = async (id) => {
  const res = await api.post(`/documents/${id}/reprocess`);
  return res.data;
};

 export const semanticSearch = async (query) => {

    const response = await api.post("/search", {
        query
    });

    return response.data.results;
};