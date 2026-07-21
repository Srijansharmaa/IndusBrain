import crypto from "crypto";
import User from "../models/User.js";
import Metric from "../models/Metric.js";
import ActivityLog from "../models/ActivityLog.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { roleLabel, plantLabel } from "../utils/labels.js";

/**
 * @route GET /api/admin/users
 */
export const getAdminUsers = asyncHandler(async (req, res) => {
    const users = await User.find().sort({ createdAt: -1 });

    res.json({
        success: true,
        users: users.map((u) => ({
            id: u._id,
            name: u.name,
            role: roleLabel(u.role),
            plant: plantLabel(u.plant),
            status: u.status,
        })),
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
