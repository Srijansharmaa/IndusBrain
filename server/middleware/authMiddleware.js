import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/User.js";

/**
 * Requires a valid `Authorization: Bearer <token>` header.
 * Attaches the authenticated user to req.user.
 */
export const protect = asyncHandler(async (req, res, next) => {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
    }

    if (!token) {
        throw new ApiError(401, "Not authorized, no token provided");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
        throw new ApiError(401, "Not authorized, user no longer exists");
    }

    req.user = user;
    next();
});

/**
 * Role gate. Use after `protect`.
 * Example: router.delete("/:id", protect, authorize("admin"), deleteDocument)
 */
export const authorize = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        throw new ApiError(403, "You do not have permission to perform this action");
    }
    next();
};
