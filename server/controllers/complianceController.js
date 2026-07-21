import ComplianceItem from "../models/ComplianceItem.js";
import Metric from "../models/Metric.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getComplianceItems = asyncHandler(async (req, res) => {
    const items = await ComplianceItem.find().sort({ createdAt: -1 });
    res.json({ success: true, items });
});

export const getComplianceMetrics = asyncHandler(async (req, res) => {
    const metrics = await Metric.find({ domain: "compliance" }).sort({ order: 1 });
    res.json({ success: true, metrics });
});

/**
 * @route POST /api/compliance/report
 * NOTE: There is no PDF report generation service wired up anywhere in this
 * project (Express or the FastAPI AI engine). This endpoint returns a
 * placeholder response with the same shape the frontend already expects
 * so the UI keeps working; wire up a real report generator here when one
 * exists.
 */
export const generateComplianceReport = asyncHandler(async (req, res) => {
    res.json({
        success: true,
        message: "Compliance report generation is not implemented yet.",
        url: null,
    });
});
