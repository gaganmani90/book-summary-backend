import * as redis from 'redis';
import { promisify } from 'util';

class RedisClient {
    private static instance: RedisClient;
    private client

    private constructor() {
        const redisUrl = process.env.REDIS_URL || "redis://localhost:6379"
        console.log(`creating instance ${redisUrl}`)
        // Create a new Redis client
        this.client = redis.createClient({
            url: redisUrl
        });

        this.client.on('error', err => console.error('redis client error', err));
        this.client.on('connect', () => console.log('redis client is connect'));
        this.client.on('reconnecting', () => console.log('redis client is reconnecting'));
        this.client.on('ready', () => console.log('redis client is ready'));

        console.log(`successfully created redis instance`)

    }

    // Send a PING command to the Redis server to verify the connection
    verifyRedisConnection() {
            //const result = await this.pingAsync()
            this.client.ping().then(
                res => console.log('Redis connection is working:', res)
            ).catch(err => {
                console.error('Redis connection error:', err);
            })
    }

    public static getInstance(): RedisClient {
        if (!RedisClient.instance) {
            RedisClient.instance = new RedisClient();
        }

        return RedisClient.instance;
    }

    public async get(key: string): Promise<string | null> {
        console.log(`getting from redis ${key}`)
        this.verifyRedisConnection()
        return this.client.get(key)
    }

    public async set(key: string, value: string) {
        console.log(`writing to redis ${{key}}`)
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
