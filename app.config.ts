import type { ConfigContext, ExpoConfig } from 'expo/config';

/**
 * One codebase, two Android variants:
 *  - phone (default)            → `npm run prebuild:phone`
 *  - Android TV (`EXPO_TV=1`)   → `npm run prebuild:tv`
 *
 * `@react-native-tvos/config-tv` applies the TV manifest changes only when
 * EXPO_TV=1: LEANBACK_LAUNCHER category, no portrait lock, touchscreen/faketouch/
 * leanback `required="false"`, TV banner + icon.
 * Both variants share one applicationId (Play Console treats TV as a form factor
 * track of the same app). iOS / tvOS are intentionally not configured.
 */
const isTV = process.env.EXPO_TV === '1';

const BACKGROUND = '#131316';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'TunisieTV',
  slug: 'tunisietv',
  version: '0.1.0',
  scheme: 'tunisietv',
  platforms: ['android'],
  orientation: isTV ? 'landscape' : 'default',
  userInterfaceStyle: 'dark',
  backgroundColor: BACKGROUND,
  icon: './assets/brand/icon.png',
  android: {
    package: 'tn.tunisietv.app',
    versionCode: 1,
    adaptiveIcon: {
      backgroundColor: BACKGROUND,
      foregroundImage: './assets/brand/adaptive-foreground.png',
      monochromeImage: './assets/brand/adaptive-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
    // No location, camera, contacts, etc. Only what playback needs.
    blockedPermissions: [
      'android.permission.RECORD_AUDIO',
      'android.permission.SYSTEM_ALERT_WINDOW',
    ],
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        backgroundColor: BACKGROUND,
        image: './assets/brand/splash-icon.png',
        imageWidth: 160,
      },
    ],
    [
      'expo-video',
      {
        supportsBackgroundPlayback: false,
        supportsPictureInPicture: false,
      },
    ],
    'expo-localization',
    // Light nav-bar icons, no contrast scrim: the dark tab bar shows through edge-to-edge.
    ['expo-navigation-bar', { style: 'light', enforceContrast: false }],
    './plugins/withOptionalHardwareFeatures',
    [
      '@react-native-tvos/config-tv',
      {
        androidTVBanner: './assets/brand/tv-banner.png',
        androidTVIcon: './assets/brand/tv-icon.png',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    isTV,
  },
});
