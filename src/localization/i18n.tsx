import { getLocales } from 'expo-localization';
import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { I18nManager } from 'react-native';

import { restartApp } from '../../modules/app-restart';
import type { LanguagePreference } from '@/data/storage/preferencesStorage';

import { type Locale, type Strings, strings } from './strings';

/** French by default; Arabic when the device's first preferred language is Arabic. */
export function detectLocale(): Locale {
  const lang = getLocales()[0]?.languageCode;
  return lang === 'ar' ? 'ar' : 'fr';
}

export function resolveLocale(preference: LanguagePreference, deviceLocale: Locale): Locale {
  return preference === 'system' ? deviceLocale : preference;
}

export const isRTLLocale = (locale: Locale) => locale === 'ar';

/**
 * Sets the native RTL flag for `locale`. Returns true when the running process
 * still has the other direction: Android only picks the flag up on a fresh start.
 */
export function applyNativeDirection(locale: Locale): boolean {
  const rtl = isRTLLocale(locale);
  I18nManager.allowRTL(rtl);
  I18nManager.forceRTL(rtl);
  return I18nManager.isRTL !== rtl;
}

/**
 * Restart so the new direction takes effect. The short delay lets
 * React Native flush the RTL flag to SharedPreferences (written with `apply()`).
 */
export function restartForDirection(): Promise<boolean> {
  return new Promise((resolve) => setTimeout(() => resolve(restartApp()), 400));
}

interface I18nValue {
  locale: Locale;
  t: Strings;
  isRTL: boolean;
  /** Saved preference (`system` follows the device). */
  language: LanguagePreference;
  setLanguage: (preference: LanguagePreference) => void;
}

const I18nContext = createContext<I18nValue>({
  locale: 'fr',
  t: strings.fr,
  isRTL: false,
  language: 'system',
  setLanguage: () => undefined,
});

export function I18nProvider({
  initialLanguage,
  deviceLocale,
  saveLanguage,
  children,
}: {
  initialLanguage: LanguagePreference;
  deviceLocale: Locale;
  saveLanguage: (preference: LanguagePreference) => Promise<void>;
  children: ReactNode;
}) {
  const [language, setLanguageState] = useState(initialLanguage);
  const locale = resolveLocale(language, deviceLocale);

  const setLanguage = useCallback(
    (next: LanguagePreference) => {
      setLanguageState(next);
      const nextLocale = resolveLocale(next, deviceLocale);
      saveLanguage(next).then(() => {
        // Strings update live; a direction change also needs a restart.
        if (applyNativeDirection(nextLocale)) restartForDirection();
      });
    },
    [deviceLocale, saveLanguage],
  );

  const value = useMemo(
    () => ({ locale, t: strings[locale], isRTL: isRTLLocale(locale), language, setLanguage }),
    [locale, language, setLanguage],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
