# TunisieTV — Testing

## Automated
| Command | What |
|---|---|
| `npm run typecheck` | `tsc --noEmit` (strict) |
| `npm run lint` | `expo lint` (ESLint 9 flat config + React Compiler rules) |
| `npm test` | Jest (`jest-expo` preset). AsyncStorage is mocked in `jest.setup.js` |

Current unit tests (`src/**/__tests__`):
- `searchChannels`: FR diacritics, Arabic tashkeel/alef normalization, monogram match, category + query.
- `catalog`: unique ids/numbers, **no stream URLs on unverified channels**, `isPlayable` rules, repository sort/lookup.
- `libraryStorage`: favorite toggle + persistence across instances (restart), history dedupe/order/cap, corrupt-data recovery, clear.

## Emulators
| AVD | Image | Notes |
|---|---|---|
| `fi-thnitek-pixel` | Pixel 8, API 35, google_apis_playstore | Phone |
| `tunisietv-tv-1080p` | tv_1080p, API 36, android-tv x86_64 | 1920×1080 @ 320 dpi = 960×540 dp. `hw.keyboard=yes`, so PC arrows + Enter act as the D-pad and Esc as Back |

```bash
"$LOCALAPPDATA/Android/Sdk/emulator/emulator" -avd tunisietv-tv-1080p
adb install -r dist-apk/tunisietv-tv-release.apk
```
Simulating remote keys: `adb shell input keyevent DPAD_DOWN|DPAD_UP|DPAD_LEFT|DPAD_RIGHT|DPAD_CENTER|BACK`.

## Manual checklists (to run per phase)
TV (✅ = verified on `tunisietv-tv-1080p` emulator, 2026-10-17, x86_64 release build):
- [x] Launches via LEANBACK_LAUNCHER intent (banner present in the manifest. Launcher row itself not yet eyeballed)
- [x] Initial focus on "Regarder". Ring + scale + glow clearly visible
- [x] D-pad within/between rows, grid, rail. Rail entry lands on the active tab. No traps found
- [x] OK opens the player. BACK returns to Home with focus restored on the hero CTA
- [x] Focused rows scroll into view. Nothing clipped at the screen edges after fixes
- [x] Favorites + history survive `am force-stop` + relaunch

Phone (realme 11 RMX3636, Android 15, 360×800 dp, arm64 release build v2, 2026-10-17):
- [x] Home, Channels (list, chip filter, heart toggle), Search (typing "nessma" → 1 result), Favorites (grid + recents), Settings, player placeholder all render and work
- [x] System back from the player returns to Home. Favorites/history stay in sync across screens
- [ ] Touch targets ≥ 48 dp. Pressed feedback visible (not measured)
- [ ] Rotation does not break layouts (not tested)
- Defects found on v2 and fixed in v3: TV focus ring/glow drawn on phone (focus visuals now TV-only); active tab pill drawn square after navigation (Fabric + radius 9999); light gray system nav bar (expo-navigation-bar `style: light`, `enforceContrast: false`). **All three fixes verified on the device 2026-10-17 (v3 + tab-pill remount fix)**. Tab pill: the corner radius was lost on any style update (Fabric), so the pill now remounts when its active state changes

Playback (Phase 4), 2026-10-17, test streams from `stream-rights-checklist.md` §2:
- realme 11 (Android 15, arm64 release):
  - [x] Apple bipbop plays; spinner while loading; controls auto-hide after 4 s
  - [x] Tap shows the controls; pause/play
  - [x] Next zaps to the Mux stream, which plays
  - [x] Tapping Wataniya 1 in the strip shows "Flux non disponible"
  - [x] Fixed after the first build: loading label overlapping prev/next, truncated names in the zap strip, dimmed play button on unavailable channels
  - [ ] Not tested: landscape fill, fullscreen button, the last build (the phone was asleep)
- TV emulator (API 36, x86_64 release):
  - [x] Full-bleed playback; chrome hides after 5 s
  - [x] Any D-pad key shows the chrome with focus on play/pause; OK pauses and resumes
  - [x] BACK with the chrome hidden returns to Home with focus on "Regarder"
  - [x] Deep link → BACK goes to Home, not out of the app
  - [x] "Continuer à regarder" lists the stream after playback
  - [x] Broken URL (temporary build): "Reconnexion… (tentative n/3)", then the "Lecture impossible" card with **Réessayer** focused; OK on it restarts loading
  - [x] Fixed: chrome text unreadable over bright video (stronger scrims)
  - [ ] Not tested: the NetInfo "offline" card and auto-reconnect when the network returns. The emulator's airplane mode did not cut its network
- Unit: `retryPolicy` (2 s → 4 s → 8 s, then manual)

Arabic / RTL (Phase 5), TV emulator (API 36, x86_64 release), 2026-10-17:
- [x] Settings shows Appareil / Français / العربية; focus starts on the selected option
- [x] Choosing العربية restarts the app into a fully mirrored UI: rail on the right, rows and grid right-to-left, Arabic strings and descriptions
- [x] D-pad: ◀ moves forward along rows and the grid; ▶ from the first item enters the rail on the active tab
- [x] Player: top bar and zap strip mirrored; media controls stay LTR (⏮ ⏯ ⏭)
- [x] Choosing Français restarts back into LTR; favorites and history survive both restarts
- [ ] Phone in Arabic: not run yet (back arrow flip, search input alignment)
- Unit: language preference persistence + corrupt values, `resolveLocale`, FR/AR string key parity, Arabic plural forms

Release hardening (Phase 6), TV emulator (API 36, x86_64, R8 on), 2026-10-17:
- [x] R8 + shrinkResources build launches with no crash; Home, Channels, Settings render
- [x] Playback (Mux test stream) and zapping work under R8
- [x] Arabic ↔ French restart works under R8 (the restart module survives shrinking)
- [x] `TEST_STREAMS=0` → 6 channels; `TEST_STREAMS=1` → 8, both without a prebuild in between
- [x] Build signed with a throwaway upload key: `apksigner verify` shows the upload certificate, installs and runs (the key was deleted afterwards)
- [ ] `build-aab.sh`: syntax-checked only; a real bundle needs your upload key
- [ ] Phone build with R8: built, not run on a device yet

