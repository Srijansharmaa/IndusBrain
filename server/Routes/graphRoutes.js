import express from "express";
import {
    getGraphNodes,
    getGraphEdges,
    getHeroPath,
    getNodeDetails,
    getGraphStats,
} from "../controllers/graphController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/nodes", getGraphNodes);
router.get("/edges", getGraphEdges);
router.get("/hero-path", getHeroPath);
router.get("/stats", getGraphStats);
router.get("/nodes/:nodeId", getNodeDetails);
// Singular alias to match the /api/graph/node/:id form some clients expect;
// same handler as the plural route above.
router.get("/node/:nodeId", getNodeDetails);

export default router;
