/**
 * Standard application error.
 * Throw `new ApiError(404, "Document not found")` from anywhere inside an
 * asyncHandler-wrapped controller and it will be turned into a consistent
 * JSON error response by the centralized error middleware.
 */
class ApiError extends Error {
    constructor(statusCode, message, details = null) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default ApiError;
