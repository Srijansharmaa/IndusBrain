import {
    getKnowledgeGraphNodes
} from "../services/aiService.js";
import asyncHandler from "../utils/asyncHandler.js";
import escapeRegex from "../utils/escapeRegex.js";
import formatRelativeTime from "../utils/formatRelativeTime.js";
import { RISK_RANK_STAGE } from "../utils/riskRank.js";
import * as complianceEngine from "../services/ai/complianceEngine.js";
import * as recommendationEngine from "../services/ai/recommendationEngine.js";

const ALLOWED_COMPLIANCE_SORT_FIELDS = new Set(["name", "status", "risk", "createdAt"]);

/**
 * @route GET /api/compliance/items
 * Query params (all optional, backward compatible): page, limit,
 * search (name), status, risk, sort (field, prefix "-" for descending).
 */
export const getComplianceItems = asyncHandler(async (req, res) => {

    const { nodes = [] } = await getKnowledgeGraphNodes();

    const items = nodes
        .filter(node => node.properties)
        .map(node => {

            let status = "Valid";

            if (node.properties.health < 80)
                status = "Expired";
            else if (node.properties.health < 90)
                status = "Expiring";

            return {

                id: node.id,

                name: node.label,

                status,

                risk: node.properties.risk,

                exp:
                    node.properties.lastInspection ??
                    "Unknown"

            };

        });

    res.json({

        success: true,

        items,

        pagination: {

            total: items.length

        }

    });

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
export const getComplianceMetrics = asyncHandler(async (req, res) => {

    const { nodes = [] } = await getKnowledgeGraphNodes();

    const equipment = nodes.filter(node => node.properties);

    const total = equipment.length;

    const valid = equipment.filter(
        node => node.properties.health >= 90
    ).length;

    const expiring = equipment.filter(
        node =>
            node.properties.health >= 80 &&
            node.properties.health < 90
    ).length;

    const expired = equipment.filter(
        node => node.properties.health < 80
    ).length;

    const score =
        total === 0
            ? 0
            : Math.round((valid / total) * 100);

    res.json({
        success: true,
        metrics: [
            {
                label: "Compliance Score",
                value: `${score}%`,
                icon: "ShieldCheck",
                color: "primary"
            },
            {
                label: "Valid",
                value: valid,
                icon: "FileCheck2",
                color: "success"
            },
            {
                label: "Expiring",
                value: expiring,
                icon: "Clock",
                color: "warning"
            },
            {
                label: "Expired",
                value: expired,
                icon: "AlertTriangle",
                color: "danger"
            }
        ]
    });

});
/**
 * @route GET /api/compliance/audit-timeline
 * Compliance-scoped slice of ActivityLog (type: "compliance").
 */
export const getAuditTimeline = asyncHandler(async (req, res) => {

    const { nodes = [] } = await getKnowledgeGraphNodes();

    const timeline = nodes
        .filter(node => node.properties)
        .sort((a, b) =>
            new Date(b.properties.lastInspection || 0) -
            new Date(a.properties.lastInspection || 0)
        )
        .slice(0, 10)
        .map(node => ({

            message:
                `${node.label} inspected - ${node.properties.maintenanceStatus}`,

            time: formatRelativeTime(
                node.properties.lastInspection || new Date()
            ),

            at: node.properties.lastInspection || new Date()

        }));

    res.json({
        success: true,
        timeline
    });

});
/**
 * @route GET /api/compliance/pending-audits
 * Items with status "Expiring" - due for renewal but not yet lapsed.
 */
export const getPendingAudits = asyncHandler(async (req, res) => {

    const { nodes = [] } =
        await getKnowledgeGraphNodes();

    const pendingAudits = nodes
        .filter(
            n =>
                n.properties &&
                n.properties.health >= 80 &&
                n.properties.health < 90
        )
        .map(n => ({

            name: n.label,

            risk: n.properties.risk,

            exp: n.properties.lastInspection

        }));

    res.json({

        success: true,

        pendingAudits

    });

});

/**
 * @route GET /api/compliance/violations
 * Items with status "Expired" - already lapsed, the actual violations.
 */
export const getViolations = asyncHandler(async (req, res) => {

    const { nodes = [] } =
        await getKnowledgeGraphNodes();

    const violations = nodes
        .filter(
            n =>
                n.properties &&
                n.properties.health < 80
        )
        .map(n => ({

            name: n.label,

            risk: n.properties.risk,

            status: "Expired",

            exp: n.properties.lastInspection

        }));

    res.json({

        success: true,

        violations

    });

});

/**
 * @route GET /api/compliance/risk-assessment
 * Groups compliance items by risk level and by status, for a risk-matrix
 * style view.
 */
export const getRiskAssessment = asyncHandler(async (req, res) => {

    const { nodes = [] } = await getKnowledgeGraphNodes();

    const equipment = nodes.filter(node => node.properties);

    const byRisk = {
        High: 0,
        Medium: 0,
        Low: 0
    };

    const byStatus = {
        Valid: 0,
        Expiring: 0,
        Expired: 0
    };

    equipment.forEach(node => {

        const risk = node.properties.risk || "Low";

        if (byRisk[risk] !== undefined) {
            byRisk[risk]++;
        }

        if (node.properties.health >= 90)
            byStatus.Valid++;
        else if (node.properties.health >= 80)
            byStatus.Expiring++;
        else
            byStatus.Expired++;

    });

    const highRiskItems = equipment
        .filter(node => node.properties.risk === "High")
        .map(node => ({
            name: node.label,
            status:
                node.properties.health >= 90
                    ? "Valid"
                    : node.properties.health >= 80
                    ? "Expiring"
                    : "Expired",
            exp: node.properties.lastInspection || "Unknown"
        }));

    res.json({
        success: true,
        riskAssessment: {
            total: equipment.length,
            byRisk,
            byStatus,
            highRiskItems
        }
    });

});

/**
 * @route GET /api/compliance/recommendations
 * Query params: query (free text to match against). Reuses
 * recommendationEngine's metadata-only matching (no embeddings) rather
 * than duplicating the lookup logic here.
 */
export const getComplianceRecommendations = asyncHandler(async (req, res) => {

    const { nodes = [] } = await getKnowledgeGraphNodes();

    const recommendations = nodes
        .filter(node => node.properties)
        .filter(node =>
            node.properties.health < 90 ||
            node.properties.risk === "High"
        )
        .sort((a, b) =>
            a.properties.health - b.properties.health
        )
        .slice(0, 5)
        .map(node => ({

            equipment: node.label,

            recommendation:
                node.properties.health < 80
                    ? "Immediate inspection and corrective maintenance required."
                    : node.properties.risk === "High"
                    ? "Schedule preventive maintenance and safety audit."
                    : "Monitor equipment and perform routine inspection.",

            risk: node.properties.risk,

            health: node.properties.health,

            failureProbability: node.properties.failureProbability

        }));

    res.json({

        success: true,

        recommendations

    });

});
