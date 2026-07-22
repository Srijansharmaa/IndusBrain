import crypto from "crypto";
import User from "../models/User.js";
import Metric from "../models/Metric.js";
import ActivityLog from "../models/ActivityLog.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { roleLabel, plantLabel, PLANT_LABELS } from "../utils/labels.js";
import escapeRegex from "../utils/escapeRegex.js";

const ALLOWED_USER_SORT_FIELDS = new Set(["name", "email", "role", "status", "createdAt"]);

/**
 * @route GET /api/admin/users
 * Query params (all optional, all backward compatible - calling with none
 * behaves exactly as before): page, limit, search (name/email), role,
 * status, sort (field name, prefix with "-" for descending).
 */
export const getAdminUsers = asyncHandler(async (req, res) => {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || 0, 100);
    const search = req.query.search?.trim();
    const { role, status } = req.query;

    const filter = {};
    if (search) {
        const safe = escapeRegex(search);
        filter.$or = [
            { name: { $regex: safe, $options: "i" } },
            { email: { $regex: safe, $options: "i" } },
        ];
    }
    const ALLOWED_ROLES = new Set(["maint", "plant", "safety", "compliance", "quality", "admin"]);
    const ALLOWED_STATUSES = new Set(["Active", "Invited", "Suspended"]);
    if (role && ALLOWED_ROLES.has(role)) filter.role = role;
    if (status && ALLOWED_STATUSES.has(status)) filter.status = status;

    let sortField = "createdAt";
    let sortDir = -1;
    if (req.query.sort) {
        const raw = String(req.query.sort);
        const desc = raw.startsWith("-");
        const field = desc ? raw.slice(1) : raw;
        if (ALLOWED_USER_SORT_FIELDS.has(field)) {
            sortField = field;
            sortDir = desc ? -1 : 1;
        }
    }

    let query = User.find(filter).sort({ [sortField]: sortDir });
    if (limit) {
        query = query.skip((page - 1) * limit).limit(limit);
    }

    const [users, total] = await Promise.all([query, User.countDocuments(filter)]);

    res.json({
        success: true,
        users: users.map((u) => ({
            id: u._id,
            name: u.name,
            email: u.email,
            roleId: u.role,
            role: roleLabel(u.role),
            plantId: u.plant,
            plant: plantLabel(u.plant),
            status: u.status,
        })),
        pagination: limit
            ? { page, limit, total, pages: Math.ceil(total / limit) }
            : { total },
    });
});

/**
 * @route GET /api/admin/metrics
 */
export const getAdminMetrics = asyncHandler(async (req, res) => {
    const metrics = await Metric.find({ domain: "admin" }).sort({ order: 1 });

    res.json({ success: true, metrics });
});

/**
 * @route GET /api/admin/activity-log
 */
export const getActivityLog = asyncHandler(async (req, res) => {
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);

    const logs = await ActivityLog.find()
        .sort({ createdAt: -1 })
        .limit(limit);

    res.json({
        success: true,
        activityLog: logs.map((l) => l.message),
    });
});

/**
 * @route GET /api/admin/departments
 * User counts per plant, including known plants with zero users (from the
 * PLANT_LABELS catalog) so a new plant shows up in admin UI immediately,
 * not just once someone's assigned to it.
 */
export const getDepartments = asyncHandler(async (req, res) => {
    const counts = await User.aggregate([
        { $match: { plant: { $ne: null } } },
        { $group: { _id: "$plant", count: { $sum: 1 } } },
    ]);
    const countsById = Object.fromEntries(counts.map((c) => [c._id, c.count]));

    const departments = Object.keys(PLANT_LABELS).map((id) => ({
        id,
        name: plantLabel(id),
        userCount: countsById[id] || 0,
    }));

    res.json({ success: true, departments });
});

/**
 * @route PATCH /api/admin/users/:id
 * Updates role/plant/status on an existing user. This is completion of
 * basic CRUD on the User collection that already existed (create via
 * invite, read via list) - not a new business domain. Covers
 * activate/deactivate (via status) and role reassignment.
 */
export const updateAdminUser = asyncHandler(async (req, res) => {
    const ALLOWED_ROLES = new Set(["maint", "plant", "safety", "compliance", "quality", "admin"]);
    const ALLOWED_STATUSES = new Set(["Active", "Invited", "Suspended"]);
    const { role, plant, status } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (role !== undefined) {
        if (!ALLOWED_ROLES.has(role)) throw new ApiError(400, "Invalid role");
        user.role = role;
    }
    if (plant !== undefined) user.plant = plant;
    if (status !== undefined) {
        if (!ALLOWED_STATUSES.has(status)) throw new ApiError(400, "Invalid status");
        user.status = status;
    }

    await user.save();

    await ActivityLog.create({
        message: `Updated ${user.email} (role: ${user.role}, status: ${user.status})`,
        actor: req.user?._id,
    });

    res.json({
        success: true,
        message: "User updated",
        user: {
            id: user._id,
            name: user.name,
            role: roleLabel(user.role),
            plant: plantLabel(user.plant),
            status: user.status,
        },
    });
});

/**
 * @route DELETE /api/admin/users/:id
 */
export const deleteAdminUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (String(user._id) === String(req.user._id)) {
        throw new ApiError(400, "You cannot delete your own account");
    }

    await user.deleteOne();

    await ActivityLog.create({
        message: `Removed user ${user.email}`,
        actor: req.user?._id,
    });

    res.json({ success: true, message: "User removed" });
});

/**
 * @route POST /api/admin/users/invite
 */
export const inviteUser = asyncHandler(async (req, res) => {
    const { email, role, name, plant } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
        throw new ApiError(409, "A user with this email already exists");
    }

    const user = await User.create({
        name: name || email.split("@")[0],
        email,
        role,
        plant: plant || null,
        status: "Invited",
        password: crypto.randomBytes(24).toString("hex"),
    });

    await ActivityLog.create({
        message: `Invited ${user.email} as ${user.role}`,
        actor: req.user?._id,
    });

    res.status(201).json({
        success: true,
        message: "Invitation sent",
        user: {
            id: user._id,
            name: user.name,
            role: roleLabel(user.role),
            plant: plantLabel(user.plant),
            status: user.status,
        },
    });
});
