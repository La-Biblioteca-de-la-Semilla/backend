import {CacheService} from "../../application/CacheService";

interface CacheItem<T> {
    value: T;
    expiresAt: number;
}

export class InMemoryCacheService implements CacheService {
    private cache: Map<string, CacheItem<unknown>> = new Map();
    private readonly DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24 horas

    get<T>(key: string): T | null {
        const item = this.cache.get(key);
        const now = Date.now();

        if (!item || now > item.expiresAt) {
            return null;
        }

        return item.value as T;
    }

    set<T>(key: string, value: T, ttl: number = this.DEFAULT_TTL): void {
        this.cache.set(key, {
            value,
            expiresAt: Date.now() + ttl
        });
    }

    invalidate(key: string): void {
        this.cache.delete(key);
    }
}