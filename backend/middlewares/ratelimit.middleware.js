import { connectRedis } from "../config/redis";

export function rateLimit(endpoint, time, limit) {
    return async (req, res, next) => {
        try {
            const ipaddr = req.ip;
            const key = `ratelimit:${endpoint}:${ipaddr}`;

            const client = await connectRedis();

            const requests = await client.incr(key);

            if (requests === 1) {
                await client.expire(key, time);
            }
            if (requests > limit) {
                return res.status(429).json({
                    message: 'Too many requests. Please try again later.',
                    retryAfter: time
                });
            }
            next();
        } catch (error) {
            console.error('Rate limit error:', error);
            next();
        }
    }
}