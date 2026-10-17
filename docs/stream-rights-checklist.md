# TunisieTV — Stream Rights Checklist

The app attempts in-app playback only when `isPlayable(channel)` is true: the channel has a non-YouTube stream URL **and** its `authorizationStatus` is not `NOT_VERIFIED` (`src/domain/models/Channel.ts`). Store builds then strip every in-app URL that isn't `VERIFIED_AUTHORIZED` or `TEST_STREAM` (`storeSafe` in `src/data/catalog/mockChannels.ts`). Unit tests (`src/data/__tests__/catalog.test.ts`) cover both rules.

YouTube sources (`format: 'youtube'`) are never played in-app: the player shows a button that opens the broadcaster's own YouTube live page in the YouTube app. Nothing is re-streamed, so these links ship in every build.

## 1. Statuses

| Status | Meaning | In-app playback |
|---|---|---|
| `VERIFIED_AUTHORIZED` | Written permission (or a published licence) from the rights holder covers redistribution in this app, for the listed regions | Yes, all builds |
| `OFFICIAL_SOURCE_PERMISSION_UNCONFIRMED` | The broadcaster publishes the stream itself, but nothing yet allows third-party apps to embed it | Dev / QA builds only |
| `NOT_VERIFIED` | Nothing checked yet | No |
| `TEST_STREAM` | Vendor-published sample for player QA. Not a TV channel | Dev / QA builds only |

Before a channel moves to `VERIFIED_AUTHORIZED` (required for its HLS stream to reach the Play Store build), record: rights holder, contact, document or licence link, date, regions, expiry, and whether a logo may be shown.

## 2. Test streams (player QA only)

| Catalog id | URL | Publisher | Terms / why it's usable |
|---|---|---|---|
| `test-apple-bipbop` | `https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_ts/master.m3u8` | Apple, "HTTP Live Streaming Examples" (developer.apple.com/streaming/examples) | Published by Apple as reference streams for developers testing HLS players. Multi-bitrate H.264/TS |
| `test-mux-bbb` | `https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8` | Mux public test streams | Content is *Big Buck Bunny* © Blender Foundation, CC BY 3.0 |

Both returned HTTP 200 on 2026-10-17. They are VOD streams, so the "live" UI is exercised with on-demand content. They ship only in dev and QA builds: `scripts/build-aab.sh` (store bundles) always leaves them out.

## 3. Broadcaster channels

HLS URLs were checked on 2026-10-17 (playlist and a media segment both returned HTTP 200). YouTube channel ids are the broadcasters' official channels (verified badge where YouTube shows one); a channel that isn't live at that moment shows its YouTube page instead.

| # | Channel | Source | Status | Notes |
|---|---|---|---|---|
| 1 | Wataniya 1 | HLS `sw1.tanitweb.net/TunisiaTV/.../watania1` | `OFFICIAL_SOURCE_PERMISSION_UNCONFIRMED` | Tanitweb runs ETT's official site and app (linked from watania1.tn). 720p |
| 2 | Wataniya 2 | HLS `sw1.tanitweb.net/TunisiaTV/.../watania2` | `OFFICIAL_SOURCE_PERMISSION_UNCONFIRMED` | Same |
| 3 | El Hiwar Ettounsi | YouTube `UCXzmMkXaHxMVlutDBD8goHA` | link-out | Verified |
| 4 | Attessia TV | YouTube `UCQS3ejF2jBAhwmbGD9Q3oeA` | link-out | Verified. attessia.tv domain is parked |
| 5 | Nessma | YouTube `UC-48PCT3flS86JkLzxlTA9g` | link-out | Verified |
| 6 | Hannibal TV | YouTube `UCMowjs_MJ-oIWEeHUu3DrOQ` | link-out | Verified ("HANNIBAL TV Officielle") |
| 7 | Telvza TV | YouTube `UCluj6itDtPuj8wUT7VlNLAQ` | link-out | Verified |
| 8 | Zitouna TV | YouTube `UCruhKc73GretC8MZASMaobA` | link-out | "Zitouna TV Officiel", not verified |
| 9 | Al Insen TV | YouTube `UCHGo-gQ_H6dnFJ9XwUxgTsA` | link-out | Verified |
| 10 | Al Janoubiya TV | YouTube `UCMjIC5ZehZ7J7DqnpzU6hFA` | link-out | Handle @janoubiyatv, not verified |
| 11 | Tunisna TV | YouTube `UCefcFOtmSMDA4H8fGmSFvkQ` | link-out | Handle @tunisnatv, not verified |
| 12 | Mosaïque FM | HLS `webcam.mosaiquefm.net/mosatv/.../studio` | `OFFICIAL_SOURCE_PERMISSION_UNCONFIRMED` | Filmed radio studio, on the station's own server. 1080p |
| 13 | Diwan FM | YouTube `UCOvTt3b378hpuUXgb46UdMQ` | link-out | "Diwan FM Live", verified |
| 14 | IFM | YouTube `UCvPW0VhnTcxYjWIxCvMlw2Q` | link-out | Verified |
| 15 | Jawhara FM | YouTube `UCXowBzuwUrjfRt68d5VphAg` | link-out | Handle @jawharafm |

Not listed (no official source found): Carthage+, Watania Sports, Sahel TV, Essaida TV, Nefzawa TV, CNB TV, Shems FM.
