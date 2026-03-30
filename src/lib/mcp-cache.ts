/**
 * Lightweight in-memory LRU cache with per-entry TTL.
 *
 * Used by the MCP endpoint to avoid redundant DB queries for identical
 * read-only operations (prompt list/search/get, skill search/get, API-key auth).
 *
 * On Vercel Serverless the cache lives for the lifetime of the warm function
 * instance (typically a few minutes), which is the perfect window for deduping
 * bursts of identical requests that MCP clients tend to produce.
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class LRUTTLCache<T> {
  private map = new Map<string, CacheEntry<T>>();
  private readonly maxSize: number;
  private readonly defaultTTLMs: number;

  constructor(opts: { maxSize: number; defaultTTLSeconds: number }) {
    this.maxSize = opts.maxSize;
    this.defaultTTLMs = opts.defaultTTLSeconds * 1000;
  }

  get(key: string): T | undefined {
    const entry = this.map.get(key);
    if (!entry) return undefined;

    if (Date.now() > entry.expiresAt) {
      this.map.delete(key);
      return undefined;
    }

    // Move to end (most-recently-used)
    this.map.delete(key);
    this.map.set(key, entry);
    return entry.value;
  }

  set(key: string, value: T, ttlSeconds?: number): void {
    // Delete first so re-insert goes to end
    this.map.delete(key);

    // Evict oldest if at capacity
    if (this.map.size >= this.maxSize) {
      const oldest = this.map.keys().next().value;
      if (oldest !== undefined) this.map.delete(oldest);
    }

    this.map.set(key, {
      value,
      expiresAt: Date.now() + (ttlSeconds ? ttlSeconds * 1000 : this.defaultTTLMs),
    });
  }

  /** Remove all expired entries (called periodically). */
  prune(): void {
    const now = Date.now();
    for (const [key, entry] of this.map) {
      if (now > entry.expiresAt) this.map.delete(key);
    }
  }

  get size(): number {
    return this.map.size;
  }

  clear(): void {
    this.map.clear();
  }
}

// ---------------------------------------------------------------------------
// Pre-configured caches for the MCP endpoint
// ---------------------------------------------------------------------------

/** Authenticated user lookup by API key – avoids repeated DB hits. */
export const apiKeyCache = new LRUTTLCache<{ id: string; username: string; mcpPromptsPublicByDefault: boolean } | null>({
  maxSize: 256,
  defaultTTLSeconds: 300, // 5 min
});

/** Prompt list pages (ListPrompts handler). Keyed by filter+page hash. */
export const promptListCache = new LRUTTLCache<unknown>({
  maxSize: 200,
  defaultTTLSeconds: 120,
});

/** Individual prompt lookups (GetPrompt / get_prompt tool). */
export const promptGetCache = new LRUTTLCache<unknown>({
  maxSize: 500,
  defaultTTLSeconds: 120,
});

/** Search results for prompts and skills. */
export const searchCache = new LRUTTLCache<unknown>({
  maxSize: 300,
  defaultTTLSeconds: 60,
});

// Periodic pruning every 2 minutes to keep memory bounded
const _pruneInterval = setInterval(() => {
  apiKeyCache.prune();
  promptListCache.prune();
  promptGetCache.prune();
  searchCache.prune();
}, 120_000);
if (_pruneInterval.unref) _pruneInterval.unref();
