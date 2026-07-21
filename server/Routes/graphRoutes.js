import express from "express";
import {
    getGraphNodes,
    getGraphEdges,
    getHeroPath,
    getNodeDetails,
} from "../controllers/graphController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/nodes", getGraphNodes);
router.get("/edges", getGraphEdges);
router.get("/hero-path", getHeroPath);
router.get("/nodes/:nodeId", getNodeDetails);

export default router;
