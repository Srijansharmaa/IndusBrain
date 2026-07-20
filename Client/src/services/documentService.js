import axios from "axios";

import api from "./api";


export const getDocuments = async () => {
  const res = await api.get("/documents");
  return res.data.documents;
};

export const getDocumentCategories = async () => {
  const docs = await getDocuments();

  const categories = [
    "All",
    ...new Set(docs.map((doc) => doc.cat || "General")),
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
 export const semanticSearch = async (query) => {

    const response = await api.post("/search", {
        query
    });

    return response.data.results;
};