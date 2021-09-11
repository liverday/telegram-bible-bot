export interface CacheProvider {
    get<T>(key: string): Promise<T | string | null>;
    put(key: string, data: any): Promise<void>;
    remove(key: string): Promise<void>;
    removeAll(prefix: string): Promise<void>;
}
