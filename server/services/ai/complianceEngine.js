import ComplianceItem from "../../models/ComplianceItem.js";
import Metric from "../../models/Metric.js";

/**
 * Reuses the ComplianceItem/Metric collections already served by
 * complianceController at /api/compliance/* - see maintenanceEngine.js for
 * why the orchestrator gets its own copy of these reads rather than
 * calling its own HTTP API.
 */

export const getComplianceItems = async (filter = {}) => {
    return ComplianceItem.find(filter).sort({ createdAt: -1 });
};

export const getComplianceMetrics = async () => {
    return Metric.find({ domain: "compliance" }).sort({ order: 1 });
};

export const getExpiringItems = async () => {
    return ComplianceItem.find({ status: { $in: ["Expiring", "Expired"] } }).sort({ risk: -1 });
};

/**
 * Builds the same CSV payload complianceController.generateComplianceReport
 * streams to the client, so the orchestrator can offer "generate compliance
 * report" as an action without duplicating the export logic.
 */
export const buildComplianceReportCsv = async () => {
    const [items, metrics] = await Promise.all([getComplianceItems(), getComplianceMetrics()]);

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

    return lines.join("\n");
};

export const handleComplianceQuery = async ({ query }) => {
    const wantsReport = /\breport\b/i.test(query);
    const wantsExpiring = /\bexpir/i.test(query);

    if (wantsExpiring) {
        const expiring = await getExpiringItems();
        const answer = expiring.length
            ? `${expiring.length} compliance item(s) are expiring or expired: ${expiring
                  .slice(0, 5)
                  .map((i) => `${i.name} (${i.status}, due ${i.exp})`)
                  .join(", ")}${expiring.length > 5 ? ", and more" : ""}.`
            : "No compliance items are currently expiring or expired.";

        return {
            answer,
            confidence: 88,
            metadata: { expiringCount: expiring.length },
            sources: [],
            actions: wantsReport ? [{ label: "Generate compliance report", action: "generate_compliance_report" }] : [],
            items: expiring,
        };
    }

    const [items, metrics] = await Promise.all([getComplianceItems(), getComplianceMetrics()]);
    const byStatus = items.reduce((acc, i) => {
        acc[i.status] = (acc[i.status] || 0) + 1;
        return acc;
    }, {});

    const answer = `Compliance snapshot: ${items.length} item(s) tracked - ${Object.entries(byStatus)
        .map(([status, count]) => `${count} ${status}`)
        .join(", ")}.`;

    return {
        answer,
        confidence: 85,
        metadata: { byStatus },
        sources: [],
        actions: wantsReport ? [{ label: "Generate compliance report", action: "generate_compliance_report" }] : [],
        metrics,
        items: items.slice(0, 10),
    };
};

export default {
    getComplianceItems,
    getComplianceMetrics,
    getExpiringItems,
    buildComplianceReportCsv,
    handleComplianceQuery,
};
