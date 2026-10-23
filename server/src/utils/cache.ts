import type { NextFunction, Request, Response } from "express";

type CacheEntry = {
    value: unknown;
    expiresAt: number;
};

type CacheResponseOptions = {
    ttlSeconds?: number;
    skipPaths?: string[];
};

class InMemoryCache {
    private store = new Map<string, CacheEntry>();

    get(key: string): unknown | undefined {
        const entry = this.store.get(key);

        if (!entry) {
            return undefined;
        }

        if (entry.expiresAt <= Date.now()) {
            this.store.delete(key);
            return undefined;
        }

        return entry.value;
    }

    set(key: string, value: unknown, ttlSeconds: number): void {
        this.store.set(key, {
            value,
            expiresAt: Date.now() + ttlSeconds * 1000,
        });
    }

    delete(key: string): void {
        this.store.delete(key);
    }

    deleteByPrefix(prefix: string): void {
        for (const key of this.store.keys()) {
            if (key.startsWith(prefix)) {
                this.store.delete(key);
            }
        }
    }

    clear(): void {
        this.store.clear();
    }
}

export const apiCache = new InMemoryCache();

const DEFAULT_TTL_SECONDS = 180;
const DEFAULT_SKIP_PATHS = ["/api/auth", "/api/users", "/api/health"];

function buildCacheKey(req: Request): string {
    const userId = (req as Request & { user?: { id?: string | number } }).user?.id ?? "guest";
    const query = new URLSearchParams(
        Object.entries(req.query as Record<string, string | string[] | undefined>).reduce<Record<string, string>>((acc, [key, value]) => {
            if (value === undefined) {
                return acc;
            }

            acc[key] = Array.isArray(value) ? value.join(",") : String(value);
            return acc;
        }, {})
    ).toString();

    return `${req.method.toUpperCase()}:${req.path}:${query}:${userId}`;
}

export function cacheResponse(options: CacheResponseOptions = {}) {
    const ttlSeconds = options.ttlSeconds ?? DEFAULT_TTL_SECONDS;
    const skipPaths = options.skipPaths ?? DEFAULT_SKIP_PATHS;

    return (req: Request, res: Response, next: NextFunction): void => {
        if (req.method.toUpperCase() !== "GET") {
            next();
            return;
        }

        const isSkipped = skipPaths.some((prefix) => req.path.startsWith(prefix));
        if (isSkipped) {
            next();
            return;
        }

        const cacheKey = buildCacheKey(req);
        const cached = apiCache.get(cacheKey);

        if (cached !== undefined) {
            res.setHeader("X-Cache", "HIT");
            res.json(cached);
            return;
        }

        const originalJson = res.json.bind(res);
        res.setHeader("X-Cache", "MISS");
        res.json = ((body: unknown) => {
            apiCache.set(cacheKey, body, ttlSeconds);
            return originalJson(body);
        }) as typeof res.json;

        next();
    };
}

export function invalidateCacheByPrefix(prefix: string): void {
    apiCache.deleteByPrefix(prefix);
}

export function invalidateCacheByKey(key: string): void {
    apiCache.delete(key);
}
