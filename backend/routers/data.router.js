import { Router } from "express";
import { getVisualizationData, getSummaryData, addWeatherData } from "../controllers/data.controller.js";
import cacheMiddleware from "../middlewares/cache.middleware.js";
import { rateLimit } from "../middlewares/ratelimit.middleware.js";

const router = Router();

/**
 * @openapi
 * /api/v1/summary:
 *   get:
 *     summary: Get summary weather data
 *     tags: [Weather]
 *     responses:
 *       200:
 *         description: Summary data fetched successfully
 *       500:
 *         description: Failed to fetch summary data
 */
router.route("/summary").get(cacheMiddleware, getSummaryData);

/**
 * @openapi
 * /api/v1/visualize:
 *   get:
 *     summary: Get visualization weather data
 *     tags: [Weather]
 *     responses:
 *       200:
 *         description: Visualization data fetched successfully
 *       500:
 *         description: Failed to fetch visualization data
 */
router.route("/visualize").get(rateLimit("visualize", 60, 3), cacheMiddleware, getVisualizationData);

/**
 * @openapi
 * /api/v1/:
 *   post:
 *     summary: Add weather data
 *     tags: [Weather]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [year, temperature, humidity, rainfall]
 *             properties:
 *               year:
 *                 type: string
 *               temperature:
 *                 type: string
 *               humidity:
 *                 type: string
 *               rainfall:
 *                 type: string
 *     responses:
 *       201:
 *         description: Data added successfully
 *       400:
 *         description: All fields are required
 *       500:
 *         description: Failed to add data
 */
router.route("/").post(addWeatherData);

export default router;