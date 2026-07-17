import { COMPLIANCE_ITEMS, COMPLIANCE_METRICS } from "../constants/complianceData";

// TODO(backend): replace with `axios.get("/api/compliance/items")`
export const getComplianceItems = async () => COMPLIANCE_ITEMS;

// TODO(backend): replace with `axios.get("/api/compliance/metrics")`
export const getComplianceMetrics = async () => COMPLIANCE_METRICS;

// TODO(backend): replace with `axios.post("/api/compliance/report")`
export const generateComplianceReport = async () => ({ ok: true, url: "/reports/compliance-latest.pdf" });
