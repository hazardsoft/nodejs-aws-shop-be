type CachedObjects = unknown[]

const cacheExpiration = Number(process.env.CACHE_TTL ?? 0) * 1000
let cachedObjects: CachedObjects
let lastCacheUpdate = 0

export const save = (objects: CachedObjects): void => {
  cachedObjects = objects
  lastCacheUpdate = new Date().getTime()
}

export const retrieve = (): CachedObjects => {
  return cachedObjects
}

export const hasCache = (): boolean => {
  return !!cachedObjects
}

export const isCacheExpired = (): boolean => {
  return lastCacheUpdate + cacheExpiration < new Date().getTime()
}
