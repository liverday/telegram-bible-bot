export interface CacheProvider {
    get<T>(key: string): Promise<T | string | null>;
    put<T>(key: string, data: T): Promise<void>;
    remove(key: string): Promise<void>;
    removeAll(prefix: string): Promise<void>;
}
