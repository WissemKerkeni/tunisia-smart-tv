import { type KeyValueStore, readJson, writeJson } from './keyValueStore';

const FAVORITES_KEY = 'tunisietv:favorites:v1';
const HISTORY_KEY = 'tunisietv:history:v1';
export const HISTORY_LIMIT = 20;

export interface HistoryEntry {
  channelId: string;
  /** epoch ms */
  watchedAt: number;
}

export function createLibraryStorage(store: KeyValueStore) {
  return {
    getFavorites: () => readJson<string[]>(store, FAVORITES_KEY, []),

    async toggleFavorite(channelId: string): Promise<string[]> {
      const current = await readJson<string[]>(store, FAVORITES_KEY, []);
      const next = current.includes(channelId)
        ? current.filter((id) => id !== channelId)
        : [...current, channelId];
      await writeJson(store, FAVORITES_KEY, next);
      return next;
    },

    getHistory: () => readJson<HistoryEntry[]>(store, HISTORY_KEY, []),

    /** Most recent first, one entry per channel, capped at HISTORY_LIMIT. */
    async recordWatch(channelId: string, now: number = Date.now()): Promise<HistoryEntry[]> {
      const current = await readJson<HistoryEntry[]>(store, HISTORY_KEY, []);
      const next = [
        { channelId, watchedAt: now },
        ...current.filter((e) => e.channelId !== channelId),
      ].slice(0, HISTORY_LIMIT);
      await writeJson(store, HISTORY_KEY, next);
      return next;
    },

    clearHistory: () => store.removeItem(HISTORY_KEY),
  };
}

export type LibraryStorage = ReturnType<typeof createLibraryStorage>;
