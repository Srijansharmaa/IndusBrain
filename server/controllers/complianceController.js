import ComplianceItem from "../models/ComplianceItem.js";
import Metric from "../models/Metric.js";
import asyncHandler from "../utils/asyncHandler.js";
import escapeRegex from "../utils/escapeRegex.js";

const ALLOWED_COMPLIANCE_SORT_FIELDS = new Set(["name", "status", "risk", "createdAt"]);

/**
 * @route GET /api/compliance/items
 * Query params (all optional, backward compatible): page, limit,
 * search (name), status, risk, sort (field, prefix "-" for descending).
 */
export const getComplianceItems = asyncHandler(async (req, res) => {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || 0, 100);
    const search = req.query.search?.trim();
    const { status, risk } = req.query;

    const filter = {};
    if (search) filter.name = { $regex: escapeRegex(search), $options: "i" };
    const ALLOWED_STATUSES = new Set(["Valid", "Expiring", "Expired"]);
    const ALLOWED_RISKS = new Set(["Low", "Medium", "High"]);
    if (status && ALLOWED_STATUSES.has(status)) filter.status = status;
    if (risk && ALLOWED_RISKS.has(risk)) filter.risk = risk;

    let sortField = "createdAt";
    let sortDir = -1;
    if (req.query.sort) {
        const raw = String(req.query.sort);
        const desc = raw.startsWith("-");
        const field = desc ? raw.slice(1) : raw;
        if (ALLOWED_COMPLIANCE_SORT_FIELDS.has(field)) {
            sortField = field;
            sortDir = desc ? -1 : 1;
        }
    }

    let query = ComplianceItem.find(filter).sort({ [sortField]: sortDir });
    if (limit) {
        query = query.skip((page - 1) * limit).limit(limit);
    }

    const [items, total] = await Promise.all([query, ComplianceItem.countDocuments(filter)]);

    res.json({
        success: true,
        items,
        pagination: limit
            ? { page, limit, total, pages: Math.ceil(total / limit) }
            : { total },
    });
});

export const getComplianceMetrics = asyncHandler(async (req, res) => {
    const metrics = await Metric.find({ domain: "compliance" }).sort({ order: 1 });
    res.json({ success: true, metrics });
});

/**
 * @route POST /api/compliance/report
 *
 * Generates a real CSV export of compliance items + metrics and streams it
 * back as a file download. This is intentionally CSV rather than PDF: no
 * PDF library (e.g. pdfkit) is currently in server/package.json, and adding
 * one could not be verified in this environment (no network access to
 * npm install and confirm it resolves cleanly). CSV needs zero new
 * dependencies and opens in Excel/Sheets, so it's a real, working report
 * rather than a placeholder - but if a branded PDF layout is a hard
 * requirement, that's the next step and would need pdfkit (or similar)
 * added to server/package.json and installed properly.
 */
export const generateComplianceReport = asyncHandler(async (req, res) => {
    const [items, metrics] = await Promise.all([
        ComplianceItem.find().sort({ createdAt: -1 }),
        Metric.find({ domain: "compliance" }).sort({ order: 1 }),
    ]);

    const escapeCsv = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

    const lines = [
        "IndusBrain Compliance Report",
        `Generated,${new Date().toISOString()}`,
        "",
        "Metric,Value",
        ...metrics.map((m) => `${escapeCsv(m.label)},${escapeCsv(m.value)}`),
        "",
        "Item,Status,Expiry,Risk",
        ...items.map((i) => [i.name, i.status, i.exp, i.risk].map(escapeCsv).join(",")),
    ];

    const csv = lines.join("\n");
    const filename = `compliance-report-${new Date().toISOString().slice(0, 10)}.csv`;

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(csv);
});
