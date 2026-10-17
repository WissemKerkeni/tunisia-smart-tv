import type { Locale } from '@/localization/strings';

import { type KeyValueStore, readJson, writeJson } from './keyValueStore';

const LANGUAGE_KEY = 'tunisietv:language:v1';

/** `system` follows the device language. */
export type LanguagePreference = 'system' | Locale;

const VALID: readonly LanguagePreference[] = ['system', 'fr', 'ar'];

export function createPreferencesStorage(store: KeyValueStore) {
  return {
    async getLanguage(): Promise<LanguagePreference> {
      const value = await readJson<unknown>(store, LANGUAGE_KEY, 'system');
      return VALID.includes(value as LanguagePreference) ? (value as LanguagePreference) : 'system';
    },
    setLanguage: (value: LanguagePreference) => writeJson(store, LANGUAGE_KEY, value),
  };
}

export type PreferencesStorage = ReturnType<typeof createPreferencesStorage>;
