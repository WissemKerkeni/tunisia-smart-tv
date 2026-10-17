import { createMemoryStore } from '@/data/storage/keyValueStore';
import { createPreferencesStorage } from '@/data/storage/preferencesStorage';

describe('preferencesStorage', () => {
  it('defaults to the system language', async () => {
    expect(await createPreferencesStorage(createMemoryStore()).getLanguage()).toBe('system');
  });

  it('persists the choice across instances', async () => {
    const store = createMemoryStore();
    await createPreferencesStorage(store).setLanguage('ar');
    expect(await createPreferencesStorage(store).getLanguage()).toBe('ar');
  });

  it('ignores unknown or corrupt values', async () => {
    expect(
      await createPreferencesStorage(createMemoryStore({ 'tunisietv:language:v1': '"de"' })).getLanguage(),
    ).toBe('system');
    expect(
      await createPreferencesStorage(createMemoryStore({ 'tunisietv:language:v1': '{oops' })).getLanguage(),
    ).toBe('system');
  });
});
