import { requireOptionalNativeModule } from 'expo-modules-core';

interface AppRestartModule {
  restart(): void;
}

const native = requireOptionalNativeModule<AppRestartModule>('AppRestart');

/**
 * Kills and relaunches the app process. Android applies an RTL/LTR switch
 * (`I18nManager.forceRTL`) only on a fresh start. Returns false when the native
 * module is missing (Expo Go, tests).
 */
export function restartApp(): boolean {
  if (!native) return false;
  native.restart();
  return true;
}
