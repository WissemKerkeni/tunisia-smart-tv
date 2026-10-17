import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope';
import { Sora_600SemiBold, Sora_700Bold, Sora_800ExtraBold } from '@expo-google-fonts/sora';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { LibraryProvider } from '@/features/library/LibraryProvider';
import { detectLocale, I18nProvider, syncNativeDirection } from '@/localization/i18n';
import { colors } from '@/theme/tokens';

SplashScreen.preventAutoHideAsync();

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
  const locale = useMemo(() => detectLocale(), []);

  useEffect(() => {
    syncNativeDirection(locale);
  }, [locale]);

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  // On font failure, render with system fonts rather than block the app.
  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <I18nProvider locale={locale}>
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
