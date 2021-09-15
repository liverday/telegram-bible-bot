import { CacheProvider } from '../CacheProvider';

export default class FakeCakeProvider implements CacheProvider {
    private cache: Record<string, string> = {};

    async get<T>(key: string): Promise<string | T | null> {
        try {
            return JSON.parse(this.cache[key]);
        } catch {
            return null;
        }
    }

    async put<T>(key: string, data: T): Promise<void> {
        this.cache[key] = JSON.stringify(data);
    }

    async remove(key: string): Promise<void> {
        delete this.cache[key];
    }

    async removeAll(prefix: string): Promise<void> {
        Object.keys(this.cache).forEach(key => {
            if (key.includes(prefix)) delete this.cache[key];
        });
    }
}
