import NodeCache from 'node-cache';

const cache = new NodeCache({
  stdTTL: 600, // 10 minutos por defecto
  checkperiod: 120, // Verificar expirados cada 2 minutos
});

export const cacheMiddleware = (key: string, ttl?: number) => {
  return (req: any, _res: any, next: any) => {
    const cacheKey = `${key}:${JSON.stringify(req.params)}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      req.cached = true;
      req.data = cachedData;
      return next();
    }

    req.cacheKey = cacheKey;
    req.cacheTTL = ttl;
    next();
  };
};

export const setCache = (key: string, data: any, ttl?: number) => {
  if (ttl !== undefined) {
    cache.set(key, data, ttl);
  } else {
    cache.set(key, data);
  }
};

export const getCache = (key: string) => {
  return cache.get(key);
};

export const deleteCache = (key: string) => {
  cache.del(key);
};

export const clearCache = () => {
  cache.flushAll();
};

export default cache;
