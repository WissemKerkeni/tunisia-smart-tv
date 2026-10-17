import { getLocales } from 'expo-localization';
import { createContext, type ReactNode, useContext, useMemo } from 'react';
import { I18nManager } from 'react-native';

import { type Locale, type Strings, strings } from './strings';

/** French by default; Arabic when the device's first preferred language is Arabic. */
export function detectLocale(): Locale {
  const lang = getLocales()[0]?.languageCode;
  return lang === 'ar' ? 'ar' : 'fr';
}

export const isRTLLocale = (locale: Locale) => locale === 'ar';

/**
 * Android applies RTL layout only after a restart. Phase 5 adds the in-app
 * language switch with reload; here we just keep the native flag in sync.
 */
export function syncNativeDirection(locale: Locale) {
  const rtl = isRTLLocale(locale);
  I18nManager.allowRTL(rtl);
  if (I18nManager.isRTL !== rtl) I18nManager.forceRTL(rtl);
}

interface I18nValue {
  locale: Locale;
  t: Strings;
  isRTL: boolean;
}

const I18nContext = createContext<I18nValue>({ locale: 'fr', t: strings.fr, isRTL: false });

export function I18nProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const value = useMemo(
    () => ({ locale, t: strings[locale], isRTL: isRTLLocale(locale) }),
    [locale],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
