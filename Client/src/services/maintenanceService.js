import { EQUIPMENT_HEALTH, RECOMMENDED_ACTIONS, RECENT_INCIDENTS } from "../constants/maintenanceData";

// TODO(backend): replace with `axios.get("/api/maintenance/equipment-health")`
export const getEquipmentHealth = async () => EQUIPMENT_HEALTH;

// TODO(backend): replace with `axios.get("/api/maintenance/recommended-actions")`
export const getRecommendedActions = async () => RECOMMENDED_ACTIONS;

// TODO(backend): replace with `axios.get("/api/maintenance/recent-incidents")`
export const getRecentIncidents = async () => RECENT_INCIDENTS;
