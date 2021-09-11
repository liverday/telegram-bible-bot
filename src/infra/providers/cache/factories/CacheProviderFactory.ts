import { CacheProvider } from '../CacheProvider';
import RedisProvider from '../implementations/RedisProvider';

export default function makeCacheProvider(): CacheProvider {
    return new RedisProvider();
}
