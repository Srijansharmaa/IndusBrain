import dotenv from "dotenv";
dotenv.config();

import crypto from "crypto";
import connectDB from "../config/db.js";
import logger from "../utils/logger.js";

import Metric from "../models/Metric.js";
import ActivityLog from "../models/ActivityLog.js";
import KnowledgeGrowth from "../models/KnowledgeGrowth.js";
import DepartmentActivity from "../models/DepartmentActivity.js";
import KnowledgeHealth from "../models/KnowledgeHealth.js";
import ComplianceItem from "../models/ComplianceItem.js";
import SuggestedQuery from "../models/SuggestedQuery.js";
import Config from "../models/Config.js";
import GraphNode from "../models/GraphNode.js";
import GraphEdge from "../models/GraphEdge.js";
import Equipment from "../models/Equipment.js";
import RecommendedAction from "../models/RecommendedAction.js";
import Incident from "../models/Incident.js";
import User from "../models/User.js";

const RESET = process.argv.includes("--reset");

const ADMIN_METRICS = [
    { domain: "admin", label: "Total Users", value: "342", delta: "+12", up: true, icon: "Users", color: "primary", order: 0 },
    { domain: "admin", label: "Plants", value: "6", icon: "Building2", color: "purple", order: 1 },
    { domain: "admin", label: "System Health", value: "99.98%", delta: "+0.02%", up: true, icon: "Activity", color: "success", order: 2 },
    { domain: "admin", label: "Graph Nodes", value: "18,204", delta: "+2.1%", up: true, icon: "Share2", color: "warning", order: 3 },
];

const ACTIVITY_LOG = [
    "Admin updated permissions for Compliance Officer role",
    "New plant added: Adani – Mundra Power",
    "System backup completed successfully",
];

const KNOWLEDGE_GROWTH = [
    { month: "Feb", docs: 1180, ai: 2400, order: 0 },
    { month: "Mar", docs: 1340, ai: 3100, order: 1 },
    { month: "Apr", docs: 1510, ai: 3820, order: 2 },
    { month: "May", docs: 1690, ai: 4650, order: 3 },
    { month: "Jun", docs: 1870, ai: 5600, order: 4 },
    { month: "Jul", docs: 2040, ai: 6700, order: 5 },
];

const DEPT_ACTIVITY = [
    { dept: "Maintenance", value: 38 },
    { dept: "Safety", value: 22 },
    { dept: "Quality", value: 16 },
    { dept: "Compliance", value: 14 },
    { dept: "Operations", value: 10 },
];

const RADAR_DATA = [
    { area: "Coverage", value: 84 },
    { area: "Accuracy", value: 91 },
    { area: "Freshness", value: 76 },
    { area: "Adoption", value: 68 },
    { area: "Connectivity", value: 88 },
];

const ANALYTICS_METRICS = [
    { domain: "analytics", label: "Knowledge Coverage", value: "84%", delta: "+3.1%", up: true, icon: "Database", color: "primary", order: 0 },
    { domain: "analytics", label: "AI Accuracy", value: "91%", delta: "+0.9%", up: true, icon: "CheckCircle2", color: "success", order: 1 },
    { domain: "analytics", label: "Most Connected", value: "Pump P101", icon: "Link2", color: "purple", order: 2 },
    { domain: "analytics", label: "Top Users", value: "128", delta: "+14%", up: true, icon: "Users", color: "warning", order: 3 },
];

const COMPLIANCE_ITEMS = [
    { name: "Boiler Unit 2 – Statutory Inspection", status: "Valid", exp: "May 2027", risk: "Low" },
    { name: "Environmental Clearance – Zone 3", status: "Valid", exp: "Jan 2027", risk: "Low" },
    { name: "Pressure Vessel Certificate – Tank T-11", status: "Expiring", exp: "02 Aug 2026", risk: "High" },
    { name: "Fire Safety Audit – Plant Wide", status: "Expiring", exp: "18 Aug 2026", risk: "Medium" },
    { name: "Electrical Safety Certificate – Sub-station 4", status: "Expired", exp: "30 Jun 2026", risk: "High" },
];

const COMPLIANCE_METRICS = [
    { domain: "compliance", label: "Compliance Score", value: "92%", delta: "+1.8%", up: true, icon: "ShieldCheck", color: "success", order: 0 },
    { domain: "compliance", label: "Valid Certificates", value: "34", icon: "FileCheck2", color: "primary", order: 1 },
    { domain: "compliance", label: "Expiring Soon", value: "5", icon: "Clock", color: "warning", order: 2 },
    { domain: "compliance", label: "Expired", value: "2", icon: "AlertTriangle", color: "danger", order: 3 },
];

const SAMPLE_QUERIES = [
    "Why did Pump P101 fail last week?",
    "What is the compliance status of Tank T-11?",
    "Summarize recent incidents at Jamnagar Zone 3",
];

const INITIAL_COPILOT_MESSAGE = {
    role: "ai",
    text: "Hi, I'm your Knowledge Copilot. Ask me anything about equipment, incidents, compliance or documents across your plant.",
};

const GRAPH_NODES = [
    { nodeId: "p101", type: "equipment", label: "Pump P101", x: 360, y: 70 },
    { nodeId: "b204", type: "equipment", label: "Bearing B-204", x: 220, y: 150 },
    { nodeId: "m12", type: "equipment", label: "Motor M-12", x: 500, y: 150 },
    { nodeId: "inc2291", type: "incident", label: "Incident INC-2291", x: 360, y: 230 },
    { nodeId: "mr0091", type: "document", label: "Maint. Report MR-0091", x: 220, y: 310 },
    { nodeId: "rec114", type: "recommendation", label: "Recommendation REC-114", x: 500, y: 310 },
    { nodeId: "sk_verma", type: "person", label: "S. Verma – Eng.", x: 70, y: 230 },
    { nodeId: "compA02", type: "equipment", label: "Compressor A-02", x: 650, y: 70 },
    { nodeId: "tnk11", type: "equipment", label: "Tank T-11", x: 640, y: 230 },
    { nodeId: "sop0044", type: "document", label: "SOP-0044", x: 500, y: 60 },
    { nodeId: "insp_q3", type: "document", label: "Inspection Q3-2026", x: 100, y: 70 },
    { nodeId: "r_iyer", type: "person", label: "R. Iyer – Safety", x: 640, y: 320 },
    { nodeId: "inc1188", type: "incident", label: "Incident INC-1188", x: 780, y: 150 },
];

const GRAPH_EDGES = [
    ["p101", "b204"], ["p101", "m12"], ["b204", "inc2291"], ["m12", "inc2291"],
    ["inc2291", "mr0091"], ["inc2291", "rec114"], ["mr0091", "sk_verma"],
    ["p101", "sop0044"], ["compA02", "m12"], ["m12", "tnk11"], ["tnk11", "inc1188"],
    ["inc1188", "r_iyer"], ["insp_q3", "b204"],
].map(([from, to]) => ({ from, to }));

const HERO_PATH = ["p101", "b204", "m12", "inc2291", "mr0091", "rec114"];

const EQUIPMENT_HEALTH = [
    { name: "Pump P101", health: 62, risk: "High", failure: 34, temp: [61, 63, 66, 68, 71, 74, 77] },
    { name: "Motor M-12", health: 71, risk: "Medium", failure: 21, temp: [58, 59, 60, 62, 63, 64, 66] },
    { name: "Compressor A-02", health: 88, risk: "Low", failure: 6, temp: [50, 51, 50, 52, 51, 53, 52] },
    { name: "Tank T-11", health: 55, risk: "High", failure: 41, temp: [40, 42, 45, 48, 52, 55, 58] },
    { name: "Boiler Unit 2", health: 93, risk: "Low", failure: 4, temp: [80, 81, 80, 82, 81, 80, 81] },
];

const RECOMMENDED_ACTIONS = [
    { t: "Replace bearing on Pump P101 within 7 days", p: "Critical", c: "danger" },
    { t: "Recalibrate pressure sensors on Tank T-11", p: "High", c: "warning" },
    { t: "Schedule routine service for Compressor A-02", p: "Normal", c: "success" },
];

const RECENT_INCIDENTS = [
    { t: "INC-2291 – Pump P101 bearing failure", d: "12 Jul 2026" },
    { t: "INC-1188 – Tank T-11 overpressure event", d: "28 Jun 2026" },
];

const DEMO_USERS = [
    { name: "Arjun Mehta", role: "plant", plant: "rel-jam", status: "Active" },
    { name: "S. Verma", role: "maint", plant: "rel-jam", status: "Active" },
    { name: "R. Iyer", role: "safety", plant: "iocl-pan", status: "Active" },
    { name: "P. Nair", role: "compliance", plant: "adani-mun", status: "Invited" },
    { name: "K. Rao", role: "quality", plant: "ntpc-vin", status: "Active" },
];

const collections = [
    { model: Metric, data: [...ADMIN_METRICS, ...ANALYTICS_METRICS, ...COMPLIANCE_METRICS] },
    { model: ActivityLog, data: ACTIVITY_LOG.map((message) => ({ message })) },
    { model: KnowledgeGrowth, data: KNOWLEDGE_GROWTH },
    { model: DepartmentActivity, data: DEPT_ACTIVITY },
    { model: KnowledgeHealth, data: RADAR_DATA },
    { model: ComplianceItem, data: COMPLIANCE_ITEMS },
    { model: SuggestedQuery, data: SAMPLE_QUERIES.map((text, order) => ({ text, order })) },
    { model: GraphNode, data: GRAPH_NODES },
    { model: GraphEdge, data: GRAPH_EDGES },
    { model: Equipment, data: EQUIPMENT_HEALTH },
    { model: RecommendedAction, data: RECOMMENDED_ACTIONS },
    { model: Incident, data: RECENT_INCIDENTS },
];

const run = async () => {
    await connectDB();

    for (const { model, data } of collections) {
        const count = await model.countDocuments();

        if (count > 0 && !RESET) {
            logger.info(`Skipping ${model.modelName} (already has ${count} documents). Pass --reset to overwrite.`);
            continue;
        }

        if (RESET) {
            await model.deleteMany({});
        }

        await model.insertMany(data);
        logger.info(`Seeded ${data.length} ${model.modelName} document(s).`);
    }

    await Config.findOneAndUpdate(
        { key: "graph.heroPath" },
        { key: "graph.heroPath", value: HERO_PATH },
        { upsert: true }
    );

    await Config.findOneAndUpdate(
        { key: "copilot.welcomeMessage" },
        { key: "copilot.welcomeMessage", value: INITIAL_COPILOT_MESSAGE },
        { upsert: true }
    );

    // Seeded individually via create() (not insertMany) so the password
    // hashing pre-save hook actually runs.
    const userCount = await User.countDocuments();
    if (userCount === 0 || RESET) {
        if (RESET) await User.deleteMany({});

        for (const demoUser of DEMO_USERS) {
            const email = `${demoUser.name.toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.+|\.+$/g, "")}@indusbrain.local`;
            const exists = await User.findOne({ email });
            if (exists) continue;

            await User.create({
                ...demoUser,
                email,
                password: crypto.randomBytes(24).toString("hex"),
            });
        }
        logger.info(`Seeded ${DEMO_USERS.length} demo User document(s).`);
    } else {
        logger.info(`Skipping User (already has ${userCount} documents). Pass --reset to overwrite.`);
    }

    logger.info("Seed complete.");
    process.exit(0);
};

run().catch((err) => {
    logger.error("Seed failed:", err.message);
    process.exit(1);
});
