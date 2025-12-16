// Local Cache Service - Persists React Query data for offline reading

const CACHE_KEY = 'mindmate-offline-cache';
const CACHE_VERSION = 1;

interface CacheData {
  version: number;
  timestamp: number;
  data: Record<string, unknown>;
}

export function saveToLocalCache(key: string, data: unknown): void {
  try {
    const cache = getFullCache();
    cache.data[key] = data;
    cache.timestamp = Date.now();
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.warn('Failed to save to local cache:', error);
  }
}

export function getFromLocalCache<T>(key: string): T | null {
  try {
    const cache = getFullCache();
    return (cache.data[key] as T) ?? null;
  } catch (error) {
    console.warn('Failed to read from local cache:', error);
    return null;
  }
}

export function getFullCache(): CacheData {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached) as CacheData;
      if (parsed.version === CACHE_VERSION) {
        return parsed;
      }
    }
  } catch (error) {
    console.warn('Failed to parse cache:', error);
  }
  
  return {
    version: CACHE_VERSION,
    timestamp: Date.now(),
    data: {},
  };
}

export function clearLocalCache(): void {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (error) {
    console.warn('Failed to clear cache:', error);
  }
}

export function getCacheTimestamp(): number | null {
  try {
    const cache = getFullCache();
    return cache.timestamp;
  } catch {
    return null;
  }
}

// Format cache timestamp for display
export function formatCacheAge(timestamp: number | null): string {
  if (!timestamp) return 'Nunca';
  
  const now = Date.now();
  const diff = now - timestamp;
  
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (minutes < 1) return 'Agora';
  if (minutes < 60) return `${minutes}min atrás`;
  if (hours < 24) return `${hours}h atrás`;
  return `${days}d atrás`;
}
