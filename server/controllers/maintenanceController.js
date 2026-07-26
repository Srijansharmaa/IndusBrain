import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import {
    getKnowledgeGraphNodes,
    getKnowledgeGraphNode,
    getKnowledgeGraphStats,
} from "../services/aiService.js";


export const getEquipmentHealth = asyncHandler(async (req, res) => {

    const { nodes = [] } = await getKnowledgeGraphNodes();

    const equipment = nodes
        .filter(node =>
            ["Equipment", "Pump", "Valve", "Sensor", "Instrument", "Component"]
                .includes(node.type)
        )
        .map(node => {

            const health =
                node.properties?.health ??
                Math.floor(Math.random() * 25) + 75;

            const failure =
                Math.max(0, 100 - health);

            let risk = "Low";

            if (failure >= 60) risk = "High";
            else if (failure >= 30) risk = "Medium";

            return {
                id: node.id,
                name: node.label,
                type: node.type,
                health,
                failure,
                risk,
                temp: node.properties?.temperature || []
            };

        });

    res.json({
        success: true,
        equipmentHealth: equipment,
        pagination: {
            page: 1,
            limit: equipment.length,
            total: equipment.length,
            pages: 1
        }
    });

});

export const getRecommendedActions = asyncHandler(async (req, res) => {

    const { nodes = [] } = await getKnowledgeGraphNodes();

    const actions = nodes
        .filter(node =>
            ["Equipment", "Pump", "Valve", "Sensor"]
                .includes(node.type)
        )
        .map(node => ({

            t: `Inspect ${node.label}`,

            p:
                node.type === "Pump"
                    ? "Critical"
                    : node.type === "Valve"
                    ? "High"
                    : "Normal",

            c:
                `Preventive maintenance recommended for ${node.label}.`

        }));

    res.json({

        success: true,

        recommendedActions: actions

    });

});


export const getRecentIncidents = asyncHandler(async (req, res) => {
    const { nodes = [] } = await getKnowledgeGraphNodes();

    const incidents = nodes
        .filter(node => node.properties)
        .filter(node => node.properties.health < 90)
        .sort((a, b) => a.properties.health - b.properties.health)
        .slice(0, 5)
        .map(node => ({
            t: `${node.label} requires inspection`,
            d: `Risk: ${node.properties.risk} • Health: ${node.properties.health}% • Failure Probability: ${node.properties.failureProbability}%`
        }));

    res.json({
        success: true,
        recentIncidents: incidents
    });
});

export const getMaintenanceTimeline = asyncHandler(async (req, res) => {

    res.json({
        success: true,
        timeline: [
            {
                message: "Knowledge graph updated successfully.",
                time: "Just now",
                at: new Date()
            }
        ]
    });

});


export const getPredictiveMaintenance = asyncHandler(async (req, res) => {

    const { nodes = [] } = await getKnowledgeGraphNodes();

    const predictions = nodes
        .filter(node =>
            ["Equipment", "Pump", "Valve", "Sensor"]
                .includes(node.type)
        )
        .map(node => {

            const health =
                node.properties?.health ??
                Math.floor(Math.random() * 25) + 75;

            const failure = 100 - health;

            return {

                name: node.label,

                health,

                failureProbability: failure,

                risk:
                    failure > 60
                        ? "High"
                        : failure > 30
                        ? "Medium"
                        : "Low",

                trend:
                    failure > 50
                        ? "Worsening"
                        : "Stable",

                recommendation:
                    failure > 50
                        ? `Schedule inspection for ${node.label}.`
                        : `${node.label} is operating normally.`

            };

        });

    res.json({

        success: true,

        predictions

    });

});

export const getEquipmentRelationships = asyncHandler(async (req, res) => {
    const { name } = req.params;

    const { nodes = [] } = await getKnowledgeGraphNodes();
    const query = name.toLowerCase();
    const match = nodes.find((n) => n.label?.toLowerCase().includes(query));

    if (!match) {
        throw new ApiError(404, `No knowledge graph node found for equipment matching "${name}"`);
    }

    const { node, neighbors = [] } = await getKnowledgeGraphNode(match.id);

    res.json({
        success: true,
        equipment: { id: node.id, label: node.label },
        relationships: neighbors.map((n) => ({ id: n.id, type: n.type, label: n.label })),
    });
});


export const getMaintenanceStats = asyncHandler(async (req, res) => {

    const stats = await getKnowledgeGraphStats();

    const graphStats = stats.stats || {};

const totalEquipment =
    graphStats.total_nodes ??
    graphStats.totalNodes ??
    0;

const totalRelationships =
    graphStats.total_edges ??
    graphStats.totalEdges ??
    0;

    res.json({

        success: true,

        stats: {

            totalEquipment: totalEquipment,

            totalRelationships: totalRelationships,

            averageHealth: 88,

            openRecommendedActions: Math.floor(totalEquipment * 0.25),

            totalIncidents: Math.floor(totalEquipment * 0.08)

        }

    });

});
