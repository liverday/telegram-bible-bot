import { CacheProvider } from "../CacheProvider";
import { RedisProvider } from "../implementations/RedisProvider";

export function makeCacheProvider(): CacheProvider {
    return new RedisProvider();
}