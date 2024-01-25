import { Product } from "./types";

const cacheExpiration =
  Number(process.env.PRODUCTS_CACHE_EXPIRATION) * 1000 || 0;
let cachedProducts: Product[];
let lastCacheUpdate = 0;

export const setProducts = (products: Product[]): void => {
  cachedProducts = products;
  lastCacheUpdate = new Date().getTime();
};

export const getProducts = (): Product[] => {
  return cachedProducts;
};

export const hasProducts = (): boolean => {
  return !!cachedProducts;
};

export const isCacheExpired = (): boolean => {
  return lastCacheUpdate + cacheExpiration < new Date().getTime();
};
