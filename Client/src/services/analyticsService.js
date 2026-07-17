import { KNOWLEDGE_GROWTH, DEPT_ACTIVITY, RADAR_DATA, ANALYTICS_METRICS } from "../constants/analyticsData";

// TODO(backend): replace with `axios.get("/api/analytics/knowledge-growth")`
export const getKnowledgeGrowth = async () => KNOWLEDGE_GROWTH;

// TODO(backend): replace with `axios.get("/api/analytics/department-activity")`
export const getDepartmentActivity = async () => DEPT_ACTIVITY;

// TODO(backend): replace with `axios.get("/api/analytics/knowledge-health")`
export const getKnowledgeHealthRadar = async () => RADAR_DATA;

// TODO(backend): replace with `axios.get("/api/analytics/metrics")`
export const getAnalyticsMetrics = async () => ANALYTICS_METRICS;
