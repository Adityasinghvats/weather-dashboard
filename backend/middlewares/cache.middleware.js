import { connectRedis } from "../config/redis.js";

export default async function cacheMiddleware(req, res, next) {
    // Skip caching for non-GET requests
    if (req.method !== 'GET') {
        return next();
    }

    // Use URL as cache key to differentiate endpoints
    const key = `cache:${req.originalUrl || req.url}`;

    try {
        const client = await connectRedis();

        if (!client || !client.isOpen) {
            console.log('Redis not connected, skipping cache');
            return next();
        }

        const cachedData = await client.get(key);

        if (cachedData) {
            console.log(`Cache HIT for ${key}`);
            return res.json(JSON.parse(cachedData));
        }

        console.log(`Cache MISS for ${key}`);

        // Store original res.json to intercept response
        const originalJson = res.json.bind(res);

        res.json = (body) => {
            // Cache for 2 minutes (120 seconds)
            client.setEx(key, 120, JSON.stringify(body)).catch(err => {
                console.error('Redis cache set error:', err);
            });
            return originalJson(body);
        };

        next();
    } catch (error) {
        console.error('Cache middleware error:', error);
        next();
    }
}