import KnowledgeGrowth from "../models/KnowledgeGrowth.js";
import DepartmentActivity from "../models/DepartmentActivity.js";
import KnowledgeHealth from "../models/KnowledgeHealth.js";
import Metric from "../models/Metric.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getKnowledgeGrowth = asyncHandler(async (req, res) => {
    const data = await KnowledgeGrowth.find().sort({ order: 1 });
    res.json({
        success: true,
        knowledgeGrowth: data.map((d) => ({ m: d.month, docs: d.docs, ai: d.ai })),
    });
});

export const getDepartmentActivity = asyncHandler(async (req, res) => {
    const data = await DepartmentActivity.find();
    res.json({
        success: true,
        departmentActivity: data.map((d) => ({ dept: d.dept, value: d.value })),
    });
});

export const getKnowledgeHealthRadar = asyncHandler(async (req, res) => {
    const data = await KnowledgeHealth.find();
    res.json({
        success: true,
        radar: data.map((d) => ({ area: d.area, value: d.value })),
    });
});

export const getAnalyticsMetrics = asyncHandler(async (req, res) => {
    const metrics = await Metric.find({ domain: "analytics" }).sort({ order: 1 });
    res.json({ success: true, metrics });
});
