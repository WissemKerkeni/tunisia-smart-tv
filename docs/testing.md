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
