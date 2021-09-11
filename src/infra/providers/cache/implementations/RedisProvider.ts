import cacheConfig from '@config/cache';
import Redis, { Redis as RedisClient } from 'ioredis';
import { CacheProvider } from '../CacheProvider';

export default class RedisProvider implements CacheProvider {
    private client: RedisClient;

    constructor() {
        this.client = new Redis(cacheConfig.config.redis);
    }

    async get<T>(key: string): Promise<T | string | null> {
        const data = await this.client.get(key);

        if (!data) {
            return null;
        }

        try {
            const parsedResult = JSON.parse(data) as T;
            return parsedResult;
        } catch {
            return data;
        }
    }

    async put(key: string, data: any): Promise<void> {
        this.client.set(key, data);
    }

    async remove(key: string): Promise<void> {
        this.client.del(key);
    }

    async removeAll(prefix: string): Promise<void> {
        const keys = await this.client.keys(`${prefix}:*`);

        const pipeline = this.client.pipeline();

        keys.forEach(key => pipeline.del(key));

        await pipeline.exec();
    }
}
