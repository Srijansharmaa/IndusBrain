import Equipment from "../../models/Equipment.js";
import RecommendedAction from "../../models/RecommendedAction.js";
import Incident from "../../models/Incident.js";
import escapeRegex from "../../utils/escapeRegex.js";

/**
 * Reuses the exact collections maintenanceController already serves at
 * /api/maintenance/* - this file exists so the Orchestrator can pull the
 * same data programmatically (without an HTTP round-trip to itself) and
 * shape it into the unified AI response format.
 */

export const getEquipmentHealth = async () => {
    const equipment = await Equipment.find();
    return equipment.map((e) => ({
        name: e.name,
        health: e.health,
        risk: e.risk,
        failure: e.failure,
        temp: e.temp,
    }));
};

export const getRecommendedActions = async () => {
    const actions = await RecommendedAction.find();
    return actions.map((a) => ({ t: a.t, p: a.p, c: a.c }));
};

export const getRecentIncidents = async () => {
    const incidents = await Incident.find().sort({ createdAt: -1 }).limit(10);
    return incidents.map((i) => ({ t: i.t, d: i.d }));
};

/**
 * Looks up a specific piece of equipment mentioned in a query (e.g.
 * "Pump P101") against Equipment.name and any incidents whose title
 * references it, so "What happened to Pump P101?" can be answered with
 * real structured data instead of only free text from the AI Engine.
 */
export const findEquipmentMention = async (mention) => {
    if (!mention) return { equipment: null, incidents: [] };

    const regex = new RegExp(escapeRegex(mention), "i");

    const [equipment, incidents] = await Promise.all([
        Equipment.findOne({ name: regex }),
        Incident.find({ t: regex }).sort({ createdAt: -1 }).limit(5),
    ]);

    return {
        equipment: equipment
            ? {
                  name: equipment.name,
                  health: equipment.health,
                  risk: equipment.risk,
                  failure: equipment.failure,
                  temp: equipment.temp,
              }
            : null,
        incidents: incidents.map((i) => ({ t: i.t, d: i.d })),
    };
};

/**
 * Handles a "maintenance" intent end-to-end: gathers whatever structured
 * data is relevant to the query and shapes it into fields the orchestrator
 * can drop straight into the unified response.
 */
export const handleMaintenanceQuery = async ({ query, entities = {} }) => {
    const wantsSchedule = /\bschedule\b/i.test(query);
    const wantsActions = /\baction|recommend/i.test(query);

    if (entities.equipment) {
        const { equipment, incidents } = await findEquipmentMention(entities.equipment);

        if (equipment) {
            const answer = `${equipment.name} is at ${equipment.health}% health with ${equipment.risk.toLowerCase()} risk and a ${equipment.failure}% failure probability.` +
                (incidents.length
                    ? ` Recent related incidents: ${incidents.map((i) => `${i.t} (${i.d})`).join(", ")}.`
                    : " No recent incidents on record for it.");

            return {
                answer,
                confidence: 90,
                metadata: { equipment },
                charts: equipment.temp?.length
                    ? [{ type: "line", label: `${equipment.name} temperature trend`, data: equipment.temp }]
                    : [],
                actions: [],
                sources: [],
                relatedIncidents: incidents,
            };
        }
    }

    const [equipmentHealth, recommendedActions, recentIncidents] = await Promise.all([
        getEquipmentHealth(),
        wantsActions || !wantsSchedule ? getRecommendedActions() : Promise.resolve([]),
        getRecentIncidents(),
    ]);

    const highRisk = equipmentHealth.filter((e) => e.risk === "High");

    const answer = highRisk.length
        ? `${highRisk.length} piece(s) of equipment are currently High risk: ${highRisk.map((e) => e.name).join(", ")}.`
        : `No equipment is currently flagged High risk. ${equipmentHealth.length} assets are being tracked.`;

    return {
        answer,
        confidence: 85,
        metadata: { equipmentCount: equipmentHealth.length, highRiskCount: highRisk.length },
        actions: recommendedActions.map((a) => ({ label: a.t, priority: a.p, tone: a.c })),
        sources: [],
        equipmentHealth,
        recentIncidents,
    };
};

export default {
    getEquipmentHealth,
    getRecommendedActions,
    getRecentIncidents,
    findEquipmentMention,
    handleMaintenanceQuery,
};
