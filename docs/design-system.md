# TunisieTV — Design System

_Source: Stitch project `projects/5871788052375837613`, design system `assets/1286005704018735157` ("TunisieTV Cinematic Dark"). Retrieved 2026-10-16. Raw tokens: `docs/design/stitch-design-system.json`. Screens (HTML + PNG): `docs/design/screens/`._

Values marked **(Stitch)** come straight from the generated HTML or theme. Values marked **(adapted)** are our conversion of those values to React Native or Android TV density, with the reason given.

## 1. Screens retrieved from Stitch

| Concept | Stitch screen | Local files | Status |
|---|---|---|---|
| TV home | `0c0452af74d74108a45591eaac01bd96` "Accueil Android TV 1080p" | `tv-home-1080p.{html,png}` | ✅ **Reference** |
| TV home (alt) | `f5d1d72a12b04d1b9be3276f232eb01f` "Accueil Android TV (10-foot)" | `tv-home-10ft.{html,png}` | ✅ Alternative. Has a layout bug: the section heading overlaps the CTA row |
| TV player | `a6cdc6f883fc44df80ef0b1eee1404ab` "Lecteur Direct Android TV" | `tv-player.{html,png}` | ✅ |
| Phone home | `68d8e0d2ac674757a435b2e169da75f1` "Accueil Mobile" | `phone-home.{html,png}` | ✅ One defect: a card thumbnail shows a screenshot of the app itself; don't reproduce it |
| TV channel browser | `98d1fbe7192241459a86ff599b1eba13` "Chaînes Android TV 1080p" | `tv-channels.{html,png}` | ✅ 5-col grid, chips, focused tile shows an "OK Regarder" pill |
| TV favorites + settings | `afbe61651e3049549aa70d2d3c439d2a` "Favoris & Paramètres (10-foot)" | `tv-favorites-settings.{html,png}` | ✅ Favorites row + recents (left), settings panel (right) |
| Phone channel browser | `58cc31987e5648a18c841dcadd9482d8` "Chaînes Mobile" | `phone-channels.{html,png}` | ✅ Chips + list rows with heart |
| Phone player | `173d2b7806de430e80d3d9ad0b1e4eae` "Lecteur Direct Mobile" | `phone-player.{html,png}` | ✅ 16:9 player, channel card, error card, zapping row |
| Phone favorites + settings | `f669aa2e01b44a83939ae6ce6ea634b2` "Favoris & Paramètres Mobile" | `phone-favorites-settings.{html,png}` | ✅ Offline banner, 2-col favorites, recents, grouped settings. Rendered centered on a desktop canvas |

Second batch retrieved 2026-10-16, ~23:50. All 8 required concepts now exist.

**Stitch inventions the app will NOT implement:**
- Account/subscription line ("Compte connecté … Abonnement Premium"). No accounts.
- Cast button; "Replay" and "Guide TV" tabs in the phone player (the app keeps the 5-tab nav); the "Mode faible latence" toggle.
- Program titles/times, "Saison 3 · Épisode 14", reminder bells. No EPG source yet.
- Fake connection stats ("Fibre 100 Mbps", "1080p 50fps"). Connection chips show only the real NetInfo state.
- "Musique" category: not in the catalog model yet.

Stitch also generated two AI hero images: a Tunis / Sidi Bou Said night aerial, and a news studio. They're mock artwork only. The phone home's card photos are AI images with invented "TunisieTV" branding. The app ships monogram tiles instead (see §6).

## 2. Color (Stitch)

Material-3-style roles derived from brand inputs (primary `#E70013`, secondary `#C9A96E`, tertiary `#3BA9E0`, neutral `#0D0D10`).

| Token (RN name) | Value | Stitch role | Used for |
|---|---|---|---|
| `bg` | `#131316` | background / surface | App background |
| `bgDeep` | `#0E0E11` | surface_container_lowest | Side rail, player chrome |
| `surface1` | `#1B1B1E` | surface_container_low | Section bands |
| `surface2` | `#1F1F22` | surface_container | Cards |
| `surface3` | `#2A2A2D` | surface_container_high | Secondary buttons, chips |
| `surface4` | `#353438` | surface_container_highest | Pressed/hover surfaces, progress track |
| `textPrimary` | `#E5E1E6` | on_surface | Body text |
| `textSecondary` | `#E9BCB6` → **adapted** to `#A9A6AD` | on_surface_variant | Metadata. Stitch's pinkish variant tints greys red; screenshots render it as neutral grey, so we use neutral grey |
| `accent` | `#E70013` | **primary_container** | LIVE pill, active nav, primary CTA, progress fill, focus glow |
| `onAccent` | `#FFFFFF` (Stitch `#FFF8F7`) | on_primary_container | Text on red |
| `accentSoft` | `#FFB4AA` | primary | Rare: links on dark |
| `gold` | `#E4C285` | secondary | "Édition principale" style tags, premium chips |
| `goldContainer` | `#5D4514` | secondary_container | Tag background |
| `info` | `#81CFFF` | tertiary | Info badges |
| `success` | `#34D399` **(adapted)** | — | Connection-status dot. Stitch uses an ad-hoc green, not a theme role |
| `error` | `#FFB4AB` / container `#93000A` | error | Error states |
| `focusRing` | `#FFFFFF` | (ring-white) | TV focus ring |
| `divider` | `rgba(255,255,255,0.10)` | (`border-white/10`) | Card borders |
| `dividerStrong` | `rgba(255,255,255,0.15)` | (`border-white/15`) | Secondary buttons |

**Red-accent rule (Stitch output and our brief):** red appears only on LIVE indicators, the active nav item, the single primary CTA, progress fills, and the focus glow. Never on large surfaces.

Channel monogram tiles use per-channel dark gradients (brown, red, navy, green, purple, amber) seen in the screens. These are defined per channel in catalog data (`brandColor`), not in theme tokens.

## 3. Typography (Stitch)

- **Headline/display:** Sora 600/700/800. **Body/label:** Manrope 400–700. Both are Google Fonts (OFL), bundled via `expo-font`.
- Arabic: Sora and Manrope have no Arabic glyphs. **Adapted:** add **Noto Kufi Arabic** (headline) and **Noto Sans Arabic** (body), both OFL, and pick the font family by locale.

Stitch TV screens are 2560 px wide (2× of a 1280 CSS-px layout). An Android TV at 1080p is **960×540 dp**, so CSS px → dp ≈ ×0.75. Phone screens are 818 px ≈ 2× a 409 CSS-px width, so phone CSS px ≈ dp.

| Role | TV (Stitch CSS) | **TV dp (adapted)** | Phone (Stitch CSS) | **Phone dp** |
|---|---|---|---|---|
| Display (hero title) | `text-7xl` 72px Sora 800 | 54 | `text-3xl` ~30px Sora 700 | 28 |
| Section title | `text-2xl` 24–26px Sora 700 | 20 | `text-xl` 20px Sora 700 | 20 |
| Card title | `text-xl` 20px Sora 700 | 16 | `text-lg` 18px Sora 700 | 17 |
| Body / description | `text-base`–`text-lg` 16–18px Manrope | 14 | `text-sm` 14px Manrope | 14 |
| Meta / label | `text-sm` 14px Manrope 500 | 12 | `text-xs` 12px Manrope | 12 |
| Badge (LIVE, CH 01) | `text-xs`/`text-[11px]` Manrope 700, uppercase | 10–11 | `text-[10px]`–`text-xs` | 11 |

TV minimum readable size is 10 dp, which renders about 20 physical px at 1080p. This follows the "Accueil 1080p" screen.

## 4. Spacing, radii, elevation (Stitch)

- **Spacing:** Tailwind 4 px scale (`spacingScale: 2`). Most common in the screens: `gap-2/3/5`, `p-3`/`p-3.5`, `px-5–7 py-3` for buttons. Tokens: `xs 4, sm 8, md 12, lg 16, xl 24, 2xl 32, 3xl 48`.
- **TV safe area (adapted):** 48 dp horizontal / 27 dp vertical overscan margin (Android TV guideline 5%). The Stitch layout's content gutter (~48 CSS px after the 120 px rail) fits within this.
- **Radii (Stitch):** `sm 4` (badges, CH chip), `md 8` (`lg`; tags, small buttons), `lg 12` (`xl`; cards, CTAs, rail items), `full` (LIVE pill, round player buttons, avatar). The theme says `ROUND_EIGHT`; screens mostly use 12 for cards.
- **Elevation:** cards `shadow-lg`; bottom nav `0 -4 20 rgba(0,0,0,.5)`. Red glow shadows are reserved for focus and primary CTA: `0 0 24px rgba(231,0,19,.55)`.

## 5. Interaction states

| State | TV (Stitch) | Phone (Stitch / adapted) |
|---|---|---|
| **Focus: cards** | `scale 1.08` + `ring-4 white` + `glow 0 0 24 rgba(231,0,19,.55)`, 200 ms | n/a |
| **Focus: buttons, rail items** | `scale 1.05` + `ring-4 white` (+ red glow on primary) | n/a |
| Rest | border `white/10`, rail icons 80% opacity | same |
| Pressed | `scale 1.00` (`active:scale-100`); player buttons `scale .95` | opacity .85 + scale .97 **(adapted)** |
| Active nav | Red filled rounded tile (TV rail) / red pill tab (phone bottom nav) | same |
| Disabled | **(adapted)** 40% opacity, not focusable | same |
| LIVE dot | `pulseLive` 1.8 s ease-in-out, opacity 1→.4, scale 1→.85 | same |

RN implementation: ring = 4 dp white border drawn as an absolutely-positioned overlay, so focus doesn't move layout. Glow = Android `elevation` can't be colored, so use a red `boxShadow` (supported in RN ≥0.76 on New Architecture). Fall back to a semi-transparent red outer border if it renders poorly on TV GPUs.

## 6. Components (designs → React Native)

| Stitch element | Seen in | RN component (`src/components/…`) |
|---|---|---|
| Left icon rail (logo, 5 nav items, clock, profile) | TV home, TV home alt | `tv/TVSideNav` |
| Bottom nav, 5 tabs, red active pill | Phone home | `mobile/BottomTabs` |
| Hero: LIVE pill + channel chip + tag + display title + meta + description + progress + CTA row | TV home, Phone home | `channel/FeaturedHero` (TV and phone layouts) |
| LIVE pill (`● EN DIRECT` / `● DIRECT`) | all | `common/LiveBadge` |
| Tag chip (gold "Édition principale", "HD 1080p", "Sous-titres") | TV home | `common/Tag` |
| Primary / secondary CTA buttons | TV home, Phone home | `common/Button` (variants `primary`, `secondary`, `icon`) + `tv/Focusable` wrapper |
| Channel card: monogram tile on gradient + CH number + LIVE + progress + title + subtitle (+ footer meta) | TV home | `channel/ChannelCard` (size `tv` / `phone`) |
| Monogram tile (W1, AT9, HTV…) | all | `channel/ChannelMonogram` |
| Section header (title + count chip + "Tout voir ›" / D-pad hint) | TV home, Phone home | `channel/SectionHeader` |
| Horizontal row of cards | TV home, Phone home | `channel/ChannelRow` (FlatList horizontal, TV focus memory) |
| Remote hint bar (OK / ▲▼◀▶ / RETOUR) | TV home | `tv/RemoteHintBar` |
| Status chips top-right (connection, device) | TV home | `common/StatusChip` (driven by NetInfo; no fake speed values) |
| Player top bar: channel monogram + name + LIVE + clock + quality/volume chip | TV player | `player/PlayerTopBar` |
| Zapping strip "CHAÎNES EN DIRECT · Zapping rapide" | TV player | `player/ChannelZapper` |
| Program panel: category + time + title + "À suivre" card + progress | TV player | `player/ProgramInfoPanel` |
| Round control buttons (prev, play/pause, next, subtitles, favorite, grid) | TV player | `player/PlayerControls` |
| Progress bar (red fill, track `surface4`, thumb on player) | all | `common/ProgressBar` |

Data that the designs show but the app **won't fake** (we have no EPG source): program titles, times, "Saison 2 · Ep. 42", "45 min regardées". Phase 3 renders these slots only when catalog data provides them, and otherwise falls back to category + language.

## 7. RTL / Arabic notes

- The layouts mirror cleanly: rail → right edge, rows scroll right-to-left, chevrons flip. Use `start`/`end` styles only, never `left`/`right`.
- Monograms (W1, AT9) and channel numbers stay LTR inside RTL (`writingDirection: 'ltr'`).
- Progress bars fill from the start edge, so in RTL they fill right-to-left.
- D-pad: in RTL, ◀ moves toward the **end** of a row. react-native-tvos focus engine follows layout direction; check this on the emulator in Phase 5.

## 8. Still to do

- Loading/skeleton states: not designed in Stitch. Use `surface2` placeholder blocks at card size with no shimmer, which keeps motion restrained on TV.
- Empty state (favorites): designed in the TV favorites screen ("Ajouter des favoris" dashed card). Offline banner and player error card: designed in the phone screens.
