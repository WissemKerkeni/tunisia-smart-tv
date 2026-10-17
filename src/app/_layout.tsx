import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope';
import { Sora_600SemiBold, Sora_700Bold, Sora_800ExtraBold } from '@expo-google-fonts/sora';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { asyncStorageStore } from '@/data/storage/keyValueStore';
import { createPreferencesStorage, type LanguagePreference } from '@/data/storage/preferencesStorage';
import { LibraryProvider } from '@/features/library/LibraryProvider';
import {
  applyNativeDirection,
  detectLocale,
  I18nProvider,
  resolveLocale,
  restartForDirection,
} from '@/localization/i18n';
import { colors } from '@/theme/tokens';

SplashScreen.preventAutoHideAsync();

const preferences = createPreferencesStorage(asyncStorageStore);
const DIRECTION_FIX_KEY = 'tunisietv:directionFix:v1';
const deviceLocale = detectLocale();

/**
 * Reads the saved language and makes sure the native layout direction matches
 * it. A mismatch (first launch in Arabic, device language changed, a restart
 * that lost the flag) triggers one restart; the stored marker stops a loop if
 * the flag never sticks. Resolves to `null` while a restart is under way.
 */
async function loadLanguage(): Promise<LanguagePreference | null> {
  const language = await preferences.getLanguage();
  const locale = resolveLocale(language, deviceLocale);
  const mismatch = applyNativeDirection(locale);
  const attempted = await asyncStorageStore.getItem(DIRECTION_FIX_KEY);
  if (!mismatch) {
    if (attempted) await asyncStorageStore.removeItem(DIRECTION_FIX_KEY);
    return language;
  }
  if (attempted !== locale) {
    await asyncStorageStore.setItem(DIRECTION_FIX_KEY, locale);
    if (await restartForDirection()) return null;
  }
  return language; // Render anyway; mirrored layout follows on the next launch.
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Sora_600SemiBold,
    Sora_700Bold,
    Sora_800ExtraBold,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });
  const [language, setLanguage] = useState<LanguagePreference | null>(null);
  const fontsDone = fontsLoaded || !!fontError;

  useEffect(() => {
    let alive = true;
    loadLanguage()
      .catch((): LanguagePreference => 'system')
      .then((l) => alive && l && setLanguage(l));
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (fontsDone && language) SplashScreen.hideAsync();
  }, [fontsDone, language]);

  // On font failure, render with system fonts rather than block the app.
  if (!fontsDone || !language) return null;

  return (
    <SafeAreaProvider>
      <I18nProvider initialLanguage={language} deviceLocale={deviceLocale} saveLanguage={preferences.setLanguage}>
        <LibraryProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.bg },
              animation: 'fade',
            }}
          >
            <Stack.Screen name="player/[id]" options={{ animation: 'fade', presentation: 'fullScreenModal' }} />
          </Stack>
        </LibraryProvider>
      </I18nProvider>
    </SafeAreaProvider>
  );
}
