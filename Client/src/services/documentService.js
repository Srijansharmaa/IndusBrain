import { DOCUMENTS, DOCUMENT_CATEGORIES } from "../constants/documents";

// TODO(backend): replace with `axios.get("/api/documents")`
export const getDocuments = async () => DOCUMENTS;

// TODO(backend): replace with `axios.get("/api/documents/categories")`
export const getDocumentCategories = async () => DOCUMENT_CATEGORIES;

// TODO(backend): replace with `axios.post("/api/documents", formData)`
export const uploadDocument = async (file) => ({ ok: true, id: Date.now() });
