import crypto from "crypto";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import generateToken from "../utils/generateToken.js";

const slugify = (value) =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, ".")
        .replace(/^\.+|\.+$/g, "");

/**
 * @route POST /api/auth/register
 * Full email/password registration (used by real account creation flows).
 */
export const register = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
        throw new ApiError(409, "An account with this email already exists");
    }

    const user = await User.create({
        name,
        email,
        password,
        role: role === "admin" ? "maint" : role, // prevent self-elevation to admin at signup
    });

    const token = generateToken(user._id);

    res.status(201).json({
        success: true,
        message: "Account created successfully",
        token,
        user: user.toSafeObject(),
    });
});

/**
 * @route POST /api/auth/login
 * Full email/password login.
 */
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
        throw new ApiError(401, "Invalid email or password");
    }

    const token = generateToken(user._id);

    res.json({
        success: true,
        message: "Logged in successfully",
        token,
        user: user.toSafeObject(),
    });
});

/**
 * @route POST /api/auth/session
 * Lightweight workspace-entry flow matching the existing LoginScreen UI
 * (name + plant + role, no password field). Finds-or-creates a real User
 * document and issues a real JWT, so the rest of the API can stay behind
 * `protect` without requiring a UI redesign.
 */
export const session = asyncHandler(async (req, res) => {
    const { name, plant, role } = req.body;

    const email = `${slugify(name)}@indusbrain.local`;

    let user = await User.findOne({ email });

    if (!user) {
        user = await User.create({
            name,
            email,
            plant,
            role,
            password: crypto.randomBytes(24).toString("hex"),
        });
    } else {
        user.plant = plant;
        user.role = role;
        await user.save();
    }

    const token = generateToken(user._id);

    res.json({
        success: true,
        message: "Signed in successfully",
        token,
        user: user.toSafeObject(),
    });
});

/**
 * @route GET /api/auth/me
 */
export const getMe = asyncHandler(async (req, res) => {
    res.json({
        success: true,
        user: req.user.toSafeObject(),
    });
});
