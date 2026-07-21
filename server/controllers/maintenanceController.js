import Equipment from "../models/Equipment.js";
import RecommendedAction from "../models/RecommendedAction.js";
import Incident from "../models/Incident.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getEquipmentHealth = asyncHandler(async (req, res) => {
    const equipment = await Equipment.find();
    res.json({
        success: true,
        equipmentHealth: equipment.map((e) => ({
            name: e.name,
            health: e.health,
            risk: e.risk,
            failure: e.failure,
            temp: e.temp,
        })),
    });
});

export const getRecommendedActions = asyncHandler(async (req, res) => {
    const actions = await RecommendedAction.find();
    res.json({
        success: true,
        recommendedActions: actions.map((a) => ({ t: a.t, p: a.p, c: a.c })),
    });
});

export const getRecentIncidents = asyncHandler(async (req, res) => {
    const incidents = await Incident.find().sort({ createdAt: -1 });
    res.json({
        success: true,
        recentIncidents: incidents.map((i) => ({ t: i.t, d: i.d })),
    });
});
