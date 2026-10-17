import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { asyncStorageStore } from '@/data/storage/keyValueStore';
import { createLibraryStorage, type HistoryEntry, type LibraryStorage } from '@/data/storage/libraryStorage';

interface LibraryValue {
  ready: boolean;
  favorites: readonly string[];
  history: readonly HistoryEntry[];
  isFavorite: (channelId: string) => boolean;
  toggleFavorite: (channelId: string) => void;
  recordWatch: (channelId: string) => void;
  clearHistory: () => void;
}

const LibraryContext = createContext<LibraryValue | null>(null);

/** Favorites + recently watched, persisted locally (AsyncStorage). */
export function LibraryProvider({
  children,
  storage = defaultStorage,
}: {
  children: ReactNode;
  storage?: LibraryStorage;
}) {
  const [ready, setReady] = useState(false);
  const [favorites, setFavorites] = useState<readonly string[]>([]);
  const [history, setHistory] = useState<readonly HistoryEntry[]>([]);

  useEffect(() => {
    let alive = true;
    Promise.all([storage.getFavorites(), storage.getHistory()]).then(([f, h]) => {
      if (!alive) return;
      setFavorites(f);
      setHistory(h);
      setReady(true);
    });
    return () => {
      alive = false;
    };
  }, [storage]);

  const toggleFavorite = useCallback(
    (id: string) => {
      storage.toggleFavorite(id).then(setFavorites);
    },
    [storage],
  );
  const recordWatch = useCallback(
    (id: string) => {
      storage.recordWatch(id).then(setHistory);
    },
    [storage],
  );
  const clearHistory = useCallback(() => {
    storage.clearHistory().then(() => setHistory([]));
  }, [storage]);

  const value = useMemo<LibraryValue>(
    () => ({
      ready,
      favorites,
      history,
      isFavorite: (id) => favorites.includes(id),
      toggleFavorite,
      recordWatch,
      clearHistory,
    }),
    [ready, favorites, history, toggleFavorite, recordWatch, clearHistory],
  );

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

const defaultStorage = createLibraryStorage(asyncStorageStore);

export function useLibrary(): LibraryValue {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error('useLibrary must be used inside <LibraryProvider>');
  return ctx;
}
