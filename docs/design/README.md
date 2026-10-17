# docs/design — Stitch output

_Last updated: 2026-10-16_

**Stitch project:** `projects/5871788052375837613` ("TunisieTV — Android TV & Phone")
**Design system asset:** `assets/1286005704018735157` ("TunisieTV Cinematic Dark")

## What Stitch actually returned

| Artifact | Status |
|---|---|
| Design system (theme + derived color roles) | ✅ Created. Tokens saved verbatim in `stitch-design-system.json` |
| Screens | ❌ **None.** Four `generate_screen_from_text` calls timed out, and `list_screens` stayed empty through ~12 min of polling |
| Screen HTML / screenshots | ❌ None (no screens to export) |

### Generation attempts (all client timeouts, no screen produced)
1. TV home, DESKTOP, default model, full prompt, with design system
2. TV player, DESKTOP, default model, full prompt, with design system
3. TV home, DESKTOP, default model, shorter prompt, no design system param
4. Phone home, MOBILE, `GEMINI_3_5_FLASH_LITE`, short prompt (diagnostic)

### Notes on the returned tokens
- The `roundness` input was `ROUND_TWELVE`, but the project theme reports `ROUND_EIGHT`.
- Stitch's Material-style derivation sets `primary` = `#ffb4aa` (a tonal pink for dark mode). The brand red `#E70013` comes back as `primary_container`. Our "red accent" should map to `primary_container`, not `primary`.
- The input neutral was `#0D0D10`. Stitch derived `background`/`surface` = `#131316` and `surface_container_lowest` = `#0e0e11`.

### Design-system input (designMd sent to Stitch)
Stitch echoed it back unchanged in `get_project`. It is left out of the JSON file to keep that file to derived tokens only. Summary: dark cinematic, red only for LIVE, active nav, primary CTA, progress and focus glow; monogram channel tiles (no real logos); TV focus = scale 1.08 + 4px white ring + red glow; TV type 64/40/28/22/18, phone 32/24/18/15/12; 8pt grid; TV safe area 48/27px; phone targets ≥48dp; French copy, RTL-safe.
_This is our brief, not Stitch output._
