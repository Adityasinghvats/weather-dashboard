import { createClient } from "redis";
import { configDotenv } from "dotenv";

configDotenv();

const redisClient = createClient({
    socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379
    }
})
redisClient.on('error', (error) => console.error('Redis Client Error', error));
redisClient.on('connect', () => console.log('Redis Client Connected'));

export const connectRedis = async () => {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
        }
        return redisClient;
    } catch (error) {
        console.error('Error connecting to Redis:', error);
    }
}