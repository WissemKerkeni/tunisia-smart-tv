# TunisieTV — Architecture

## Stack (verified 2026-10-16)
- Expo SDK **57.0.30**, React **19.2.3**, `react-native` = **`npm:react-native-tvos@0.86-stable`** (0.86.3-0). This matches Expo's official `with-router-tv` example.
- `expo-router` 57 (Stack navigation), `expo-video` 57 (Media3/ExoPlayer on Android), `expo-image`, `expo-localization`, `expo-font` with `@expo-google-fonts/{sora,manrope}`.
- `@react-native-async-storage/async-storage` 2.2.0, `@react-native-community/netinfo` 12.0.1.
- Dev: `@react-native-tvos/config-tv` 0.1.7, TypeScript 6.0, Jest 29 + `jest-expo` 57, ESLint 9 + `eslint-config-expo` 57.
- Android only (`platforms: ['android']`). No `ios/` is ever generated.

### npm `overrides` (package.json): why they exist
| Override | Reason |
|---|---|
| `react-native` → `npm:react-native-tvos@0.86-stable` | npm resolves peer `react-native` requirements against the real registry package (0.88), not our alias. This keeps the whole tree on the TV fork |
| `react-dom` → `19.2.3` | `expo-router` has an optional `react-dom` peer. Without the pin npm picks 19.3.x, which requires React 19.3 |
| `@react-native/jest-preset` → `0.86.3` | Must match the RN version (`jest-expo` would otherwise pull 0.88) |

Drop these when moving to SDK 58 + `react-native-tvos@0.88-stable`.

## Layers
```
src/
  app/            Expo Router routes. Thin: compose components + hooks
  components/
    common/       AppText (type scale per TV/phone), shared primitives
    tv/           Focusable (D-pad focus: scale + ring overlay + glow)
    channel/      ChannelMonogram, ChannelCard
    player/       PlayerStatusCard (loading / retry / error / unavailable), ZapStrip
    mobile/       BottomTabs
  domain/
    models/       Channel (+ isPlayable)
    usecases/     searchChannels (FR/AR normalization, category filter)
  data/
    catalog/      mockChannels: names only, stream.url = null, NOT_VERIFIED
    repositories/ ChannelRepository interface + LocalChannelRepository
    storage/      KeyValueStore (AsyncStorage / in-memory), libraryStorage (favorites, history),
                  preferencesStorage (language: system | fr | ar)
  features/       library (LibraryProvider), player (usePlayback, useAutoHide)
  services/       playback/retryPolicy
  hooks/          useChannels / useChannel, useClock, useNetworkStatus
  localization/   strings (fr, ar), I18nProvider, language preference + RTL switch
  theme/          tokens from docs/design-system.md
  utils/          platform (isTV)
```
Rules:
- Screens never import the catalog directly. They go through the repository.
- Playback is attempted only when `isPlayable(channel)`: the channel needs a URL **and** a `VERIFIED_AUTHORIZED` or `TEST_STREAM` status.
- No backend, accounts, ads or analytics.

## Phone vs TV variants
Same JS bundle, same `applicationId` (`tn.tunisietv.app`). `app.config.ts` reads `EXPO_TV`:

| | Phone | TV (`EXPO_TV=1`) |
|---|---|---|
| Prebuild | `npm run prebuild:phone` | `npm run prebuild:tv` |
| Orientation | `default` (rotation allowed) | `landscape` |
| Launcher | `LAUNCHER` | `LAUNCHER` + `LEANBACK_LAUNCHER` (config-tv) |
| Manifest features | standard | `touchscreen`, `faketouch`, `leanback` → `required="false"` (config-tv) |
| Banner / icon | adaptive icon | `android:banner=@drawable/tv_banner`, TV icon (config-tv) |

At runtime, UI differences use `Platform.isTV` (`src/utils/platform.ts`), which react-native-tvos sets from the device's UI mode.

## Language and RTL
The language preference (`system`, `fr`, `ar`) is stored locally and read before the first render (the splash screen stays up meanwhile). Android only applies `I18nManager.forceRTL` at process start, so:
- **Switching between French and Arabic in Settings** saves the choice, sets the RTL flag, then restarts the app through the local Expo module `modules/app-restart` (Kotlin, autolinked from `modules/`). It relaunches the launcher activity in a fresh process.
- **At startup**, if the native direction doesn't match the saved language (first launch on an Arabic device, device language changed), the app restarts once. The key `tunisietv:directionFix:v1` prevents a loop if the flag never sticks.
- Layout uses `start`/`end` only. Media playback controls are pinned to `direction: 'ltr'` (Material guidance), and the phone back arrow flips to `arrow-forward` in Arabic.

`android/` is generated (Continuous Native Generation) and **gitignored**. All native changes go through `app.config.ts` and config plugins, so `prebuild --clean` can't destroy hand edits. Don't edit `android/` by hand.

## Local builds
```bash
bash scripts/build-apk.sh phone   # → dist-apk/tunisietv-phone-release.apk
bash scripts/build-apk.sh tv      # → dist-apk/tunisietv-tv-release.apk
```
Requirements: `JAVA_HOME` = JDK 17, and `ANDROID_HOME` (or the default `%LOCALAPPDATA%\Android\Sdk`). These are **QA APKs**: they include the test streams (`TEST_STREAMS=0` leaves them out) and are signed with the template debug keystore unless the upload-key variables below are set.

Release builds have R8 code shrinking and resource shrinking on (`expo-build-properties` in `app.config.ts`).

## Release builds (Play Store)
1. **Once:** create the upload key, and keep the file and its passwords outside the repo (a password manager plus a backup):
   ```bash
   bash scripts/create-upload-keystore.sh
   ```
   With Play App Signing, Google keeps the app signing key, and this upload key only authenticates uploads. If it's lost, Play support can reset it.
2. **Each release:** export the key variables and a versionCode higher than the last upload, then build one bundle per variant:
   ```bash
   export TUNISIETV_UPLOAD_STORE_FILE=~/.tunisietv/upload.p12
   export TUNISIETV_UPLOAD_STORE_PASSWORD=…  TUNISIETV_UPLOAD_KEY_PASSWORD=…
   export TUNISIETV_UPLOAD_KEY_ALIAS=tunisietv-upload
   TUNISIETV_VERSION_CODE=2 bash scripts/build-aab.sh phone
   TUNISIETV_VERSION_CODE=3 bash scripts/build-aab.sh tv
   ```
   Phone and TV share the `applicationId`, so each upload needs its own, increasing versionCode. `build-aab.sh` refuses to run without the key variables, always leaves out the test streams, runs a clean prebuild for the variant, and writes `dist-aab/` (gitignored).

How it's wired:
- `plugins/withReleaseSigning.js` adds a `release` signing config that reads `TUNISIETV_UPLOAD_*` from the environment, so no secret is ever written to the repo or `android/`.
- Test streams are toggled through `extra.includeTestStreams` (read at runtime through `expo-constants`), not an `EXPO_PUBLIC_*` variable. Gradle treats the JS bundle as up to date when only an env var changes, and Metro's cache key ignores env vars, so an inlined value can go stale between builds. `expo-constants` regenerates its config on every build. Verified 2026-10-17: flipping the flag without a prebuild changes the channel list.
