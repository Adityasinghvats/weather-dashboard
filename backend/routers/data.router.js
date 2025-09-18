import { Router } from "express";
import { getVisualizationData, getSummaryData, addWeatherData } from "../controllers/data.controller.js";

const router = Router();

router.route("/summary").get(getSummaryData);
router.route("/visualize").get(getVisualizationData);
router.route("/").post(addWeatherData);

export default router;