# TunisieTV — Implementation Plan (Phase 0 output)

_Last updated: 2026-10-16_

## 1. Environment (detected)

| Item | Status |
|---|---|
| Workspace `D:\Workspace\tunisia-smart-tv` | Empty directory, **not a git repo** → new project |
| OS / shell | Windows 11 Pro, PowerShell + Git Bash |
| Node.js | v22.23.3 (nvm) |
| npm / pnpm | 10.9.9 / 12.8.1 (yarn, bun not installed) |
| git | 2.56.0 |
| JDK | **Not found** (no `java`, no `JAVA_HOME`) |
| Android SDK | `%LOCALAPPDATA%\Android\Sdk` exists but is **incomplete**: has `cmdline-tools/latest`, `platform-tools`, `emulator`, one system image (`android-35/google_apis_playstore/x86_64`); **no `platforms/`, no `build-tools/`** |
| `ANDROID_HOME` / PATH | **Not set**; `adb` not on PATH |
| AVDs | `fi-thnitek-pixel` (Pixel 8, API 35, phone). **No Android TV AVD / TV system image** |
| Android Studio | Not found at the default location |

## 2. Stitch MCP

- **Not available in this project's session.** No Stitch tools are loaded.
- `~/.claude.json` has a `stitch` HTTP server (`https://stitch.googleapis.com/mcp`, auth by `X-Goog-Api-Key` header), but it is scoped **only to the project `D:/Workspace/gohan`**.
- Because of that, **Phase 1 is blocked**. No designs have been generated or retrieved.

### Setup steps
1. Make Stitch available at user scope (all projects) or for this project only. Run in a terminal, putting your own key in place of the placeholder:
   ```bash
   claude mcp add --transport http --scope user stitch https://stitch.googleapis.com/mcp --header "X-Goog-Api-Key: <YOUR_STITCH_API_KEY>"
   ```
   (Or use `--scope local` while in `D:\Workspace\tunisia-smart-tv` to keep it project-only.)
2. Start a new Claude Code session in this folder (MCP servers load at session start).
3. Check: `claude mcp list` should show `stitch` as connected, and the session should list `mcp__stitch__*` tools.

## 3. Recommended versions and evidence

**Target: Expo SDK 57 + `react-native-tvos@0.86-stable`.**

| Package | Version | Evidence |
|---|---|---|
| `expo` | `~57.0.x` (npm `sdk-57` → 57.0.30) | npm dist-tags |
| `react-native` | `npm:react-native-tvos@0.86-stable` (→ 0.86.3-0) | SDK 57 `bundledNativeModules.json` pins RN **0.86.3**; tvOS fork tag `0.86-stable` = 0.86.3-0 |
| `react` | `19.2.3` | SDK 57 bundledNativeModules; tvos 0.87 peer `^19.2.3` |
| `@react-native-tvos/config-tv` | `^0.1.7` (dev) | npm; Expo TV guide |
| `expo-router` | `~57.0.28` | SDK 57 bundledNativeModules; used in Expo's official `with-router-tv` example |
| `expo-video` | `~57.0.5` | SDK 57 bundledNativeModules; "Video" is listed as TV-supported in the Expo TV guide; Android backend is Media3/ExoPlayer; supports HLS, Widevine/PlayReady/ClearKey |
| `@react-native-async-storage/async-storage` | `2.2.0` | SDK 57 bundledNativeModules; "AsyncStorage" listed as TV-supported |
| `expo-image`, `expo-localization`, `@react-native-community/netinfo` | SDK 57 versions | All listed as TV-supported in the Expo TV guide |
| `jest-expo` | `~57.0.6` | npm `sdk-57` tag |

**Main evidence:** Expo's official example `expo/examples/with-router-tv` (`package.json` fetched 2026-10-16) uses `expo ~57.0.13`, `expo-router ~57.0.13`, `react-native: npm:react-native-tvos@0.86-stable`, `@react-native-tvos/config-tv ^0.1.6`, and the script `EXPO_TV=1 expo prebuild --clean`.

**Why not SDK 58 (current `latest`)?** SDK 58 pins RN **0.88.0**, but `react-native-tvos` 0.88 is only at `0.88.0-0rc2` (2026-09-30). The Expo TV guide says the tvOS fork "must match the Expo SDK you are using", so SDK 58 has no stable TV fork yet. Move to SDK 58 once `0.88-stable` ships.

**Caveats to check in Phase 2 and 4:**
- The Expo TV guide page has not been updated past SDK 56 (it names 0.85-stable for SDK 56). It says that from SDK 56 on, `npx expo install --fix` keeps the TV fork in step, so no `install.exclude` is needed.
- The expo-video docs don't name Android TV specifically. **TV playback and D-pad behaviour need hands-on checks on a TV emulator.** Fallback if that fails: `react-native-video` 6.x (Media3).
- Expo Router isn't in the guide's list of TV-supported libraries, but Expo's own TV example uses it. Plan: `Stack` navigation, no native tabs on TV, our own TV side nav.
- Toolchain: React Native docs recommend **JDK 17**, Android SDK Platform **35**, Build-Tools **36.0.0**.

## 4. Proposed structure

Expo Router keeps routes in `src/app/`; everything else is plain modules.

```
src/
  app/                    # Expo Router routes (thin: compose features)
    _layout.tsx           # providers: theme, i18n/RTL, storage, focus root
    index.tsx             # Home
    channels/index.tsx    # Browse (category filter)
    search.tsx
    favorites.tsx
    settings.tsx
    player/[id].tsx       # Full-screen player
  components/
    common/               # Button, Text, Icon, EmptyState, ErrorState, Spinner
    channel/              # ChannelCard, ChannelRow, ChannelGrid, CategoryChips
    player/               # PlayerSurface, PlayerOverlay, BufferingIndicator, ChannelZapper
    tv/                   # FocusableCard, TVSideNav, focus helpers (TVFocusGuideView)
    mobile/               # BottomTabs, touch gestures
  features/{home,channels,search,favorites,settings}/  # screen logic + hooks
  data/
    catalog/mockChannels.ts         # mock data only, no real stream URLs
    repositories/ChannelRepository.ts
    storage/ (favorites, history, preferences on AsyncStorage)
  domain/
    models/Channel.ts     # id, name, category, logo, streamUrl, authorizationStatus, language?, availability?
    usecases/             # toggleFavorite, recordWatch, searchChannels
  services/playback/      # expo-video wrapper, retry/backoff, NetInfo connectivity
  theme/                  # tokens from Stitch (colors, type, spacing, radii, focus)
  localization/           # fr.json, ar.json, i18n + I18nManager RTL
  utils/                  # platform.ts (isTV = Platform.isTV), formatting
docs/  architecture.md  design-system.md  stream-rights-checklist.md  testing.md  implementation-progress.md
```

Device-specific behaviour goes through `Platform.isTV` in small platform-aware components. Screens stay shared, and layouts change at the component level (TV: side nav and a 10-foot type scale; phone: bottom tabs and touch targets).

## 5. Build strategy (Android only)

- **One codebase, two native variants**, picked with `EXPO_TV`:
  - Phone: `expo prebuild` → `android/` with a standard launcher intent and portrait/auto orientation.
  - TV: `EXPO_TV=1 expo prebuild` → the config-tv plugin adds the TV intent and removes the portrait lock. A small custom config plugin of our own will add the following, then we check the merged manifest:
    - `LEANBACK_LAUNCHER`
    - `android.software.leanback` (required=false)
    - `android.hardware.touchscreen` (required=false)
    - a 320×180 `android:banner`
- `android/` is **generated (CNG)** and gitignored. All native changes live in `app.config.ts` and config plugins, so `prebuild --clean` can't destroy hand edits. **No `ios/` will be generated**: prebuild runs with `--platform android` only.
- npm scripts: `prebuild:phone`, `prebuild:tv`, `android:phone`, `android:tv`, `build:apk:phone`, `build:apk:tv`. Gradle `assembleRelease` runs locally; EAS is optional and not set up.
- Package IDs: both builds use the same `applicationId` (e.g. `tn.tunisietv.app`) so the Play Store treats them as one app with phone and TV form-factor tracks. Different IDs are possible if you want two separate listings.
- Use `cross-env` for `EXPO_TV` because the shell is Windows.

## 6. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Stitch MCP not connected here | Phase 1 blocked | Setup steps in §2 |
| No JDK 17, incomplete Android SDK, no TV image | Can't compile or test on TV | Install steps in §7 |
| expo-video on Android TV not documented explicitly | Player may need a fallback | Prototype early on the TV emulator; `react-native-video` fallback |
| No authorized stream URLs | Real playback can't be verified | Mock catalog plus a documented public test stream (e.g. a vendor-published HLS sample with its terms recorded) |
| Expo Router on TV focus/back | Focus loss after navigation | Follow the `with-router-tv` pattern; explicit focus restoration |
| Arabic RTL requires an app restart on Android | UX of switching language | `I18nManager.forceRTL` + `expo-updates`/`DevSettings` reload, documented |
| Workspace is not a git repo | No safety net for generated changes | `git init` before Phase 2 |

## 7. Setup steps (before Phase 2 can compile)

1. Install JDK 17 (e.g. `winget install Microsoft.OpenJDK.17`) and set `JAVA_HOME`.
2. Set `ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk`, and add `platform-tools` and `emulator` to PATH.
3. Install SDK packages:
   ```bash
   sdkmanager "platforms;android-35" "build-tools;36.0.0" "system-images;android-35;android-tv;x86"
   ```
   Run `sdkmanager --list | findstr android-tv` first to confirm the exact TV image name and ABI for API 35 or 34.
4. Create a TV AVD (Android TV 1080p device on that image) with `avdmanager` or Android Studio's Device Manager.
5. `git init` in the workspace.

## 8. Unresolved decisions

- One `applicationId` for both builds, or two? (Default: one.)
- Whether to use a public, documented test HLS stream for player QA. (Default: yes, with its source and terms recorded in `docs/stream-rights-checklist.md`.)
