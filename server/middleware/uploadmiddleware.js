import multer from "multer";
import path from "path";
import fs from "fs";
import ApiError from "../utils/ApiError.js";

const UPLOAD_DIR = path.resolve("uploads");

// Ensure the uploads directory exists before multer tries to write to it.
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Must stay in sync with ai_engine/config.py SUPPORTED_FILES. Express should
// reject an unsupported file immediately rather than accepting the upload
// and letting it fail downstream at the AI engine.
const ALLOWED_EXTENSIONS = new Set([
    ".pdf",
    ".docx",
    ".xlsx",
    ".png",
    ".jpg",
    ".jpeg",
]);

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, UPLOAD_DIR);
    },
    filename(req, file, cb) {
        const safeExt = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`);
    },
});

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    if (!ALLOWED_EXTENSIONS.has(ext)) {
        return cb(new ApiError(400, `Unsupported file type: ${ext || "unknown"}`));
    }

    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 25 * 1024 * 1024, // 25MB, matches typical document-processing limits
    },
});

export default upload;
