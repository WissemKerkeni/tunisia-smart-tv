import { createMemoryStore } from '@/data/storage/keyValueStore';
import { createLibraryStorage, HISTORY_LIMIT } from '@/data/storage/libraryStorage';

describe('libraryStorage', () => {
  it('toggles favorites and persists them', async () => {
    const store = createMemoryStore();
    const lib = createLibraryStorage(store);
    expect(await lib.toggleFavorite('nessma')).toEqual(['nessma']);
    expect(await lib.toggleFavorite('hannibal')).toEqual(['nessma', 'hannibal']);
    expect(await lib.toggleFavorite('nessma')).toEqual(['hannibal']);
    // A new instance on the same store sees the persisted value (app restart).
    expect(await createLibraryStorage(store).getFavorites()).toEqual(['hannibal']);
  });

  it('records history most-recent-first without duplicates, capped', async () => {
    const lib = createLibraryStorage(createMemoryStore());
    await lib.recordWatch('a', 1);
    await lib.recordWatch('b', 2);
    await lib.recordWatch('a', 3);
    expect((await lib.getHistory()).map((e) => e.channelId)).toEqual(['a', 'b']);

    for (let i = 0; i < HISTORY_LIMIT + 5; i++) await lib.recordWatch(`c${i}`, 10 + i);
    expect(await lib.getHistory()).toHaveLength(HISTORY_LIMIT);
  });

  it('recovers from corrupt stored data', async () => {
    const lib = createLibraryStorage(createMemoryStore({ 'tunisietv:favorites:v1': '{not json' }));
    expect(await lib.getFavorites()).toEqual([]);
  });

  it('clears history', async () => {
    const lib = createLibraryStorage(createMemoryStore());
    await lib.recordWatch('a');
    await lib.clearHistory();
    expect(await lib.getHistory()).toEqual([]);
  });
});
