import logger from "../utils/logger.js";

/**
 * 404 handler - must be registered AFTER all routes, BEFORE the error handler.
 */
export const notFound = (req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
};

/**
 * Centralized error handler - must be the LAST app.use() call.
 */
const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";
    let details = err.details || undefined;

    // Mongoose bad ObjectId
    if (err.name === "CastError") {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
    }

    // Mongoose validation errors
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = "Validation failed";
        details = Object.values(err.errors).map((e) => e.message);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        statusCode = 409;
        message = `Duplicate value for field(s): ${Object.keys(err.keyValue || {}).join(", ")}`;
    }

    // Multer errors (file too large, wrong field, etc.)
    if (err.name === "MulterError") {
        statusCode = 400;
        message = err.message;
    }

    // JWT errors
    if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid authentication token";
    }
    if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Authentication token expired";
    }

    if (statusCode >= 500) {
        logger.error(err.stack || err.message);
    } else {
        logger.warn(`${statusCode} - ${message}`);
    }

    const response = {
        success: false,
        message,
    };

    if (details) response.details = details;

    // Only include stack traces outside production, and only for real bugs (5xx)
    if (process.env.NODE_ENV !== "production" && statusCode >= 500) {
        response.stack = err.stack;
    }

    res.status(statusCode).json(response);
};

export default errorHandler;
