import * as redis from 'redis';
import { promisify } from 'util';
import {logger} from "../clients/book-summary-logger";

class RedisClient {
    private static instance: RedisClient;
    private client

    private constructor() {
        const redisUrl = process.env.REDIS_URL || "redis://localhost:6379"
        logger.info(`creating instance ${redisUrl}`)
        // Create a new Redis client
        this.client = redis.createClient({
            url: redisUrl
        });

        this.client.on('error', err => logger.error('redis client error', err));
        this.client.on('connect', () => logger.info('redis client is connect'));
        this.client.on('reconnecting', () => logger.info('redis client is reconnecting'));
        this.client.on('ready', () => logger.info('redis client is ready'));

        logger.info(`${redisUrl}: successfully created redis instance`)

    }

    // Send a PING command to the Redis server to verify the connection
    verifyRedisConnection() {
            //const result = await this.pingAsync()
            this.client.ping().then(
                res => logger.info('Redis connection is working:', res)
            ).catch(err => {
                logger.error('Redis connection error:', err);
            })
    }

    public static getInstance(): RedisClient {
        if (!RedisClient.instance) {
            RedisClient.instance = new RedisClient();
        }

        return RedisClient.instance;
    }

    public async get(key: string): Promise<string | null> {
        logger.info(`getting from redis ${key}`)
        this.verifyRedisConnection()
        return this.client.get(key)
    }

    public async set(key: string, value: string) {
        logger.info(`writing to redis ${{key}}`)
        this.verifyRedisConnection()
        await this.client.set(key, JSON.stringify(value))
    }

    public closeConnection(): void {
        this.client.quit();
    }

    public async connect() {
        await this.client.connect()
    }
}

export default RedisClient.getInstance();
