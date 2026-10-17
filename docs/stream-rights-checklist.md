# TunisieTV — Stream Rights Checklist

The app attempts playback only when `isPlayable(channel)` is true: the channel has a stream URL **and** its `authorizationStatus` is `VERIFIED_AUTHORIZED` or `TEST_STREAM` (`src/domain/models/Channel.ts`). A unit test (`src/data/__tests__/catalog.test.ts`) fails if any other channel carries a URL.

## 1. Statuses

| Status | Meaning | Playback |
|---|---|---|
| `VERIFIED_AUTHORIZED` | Written permission (or a published licence) from the rights holder covers redistribution in this app, for the listed regions | Yes |
| `OFFICIAL_SOURCE_PERMISSION_UNCONFIRMED` | The broadcaster publishes the stream itself, but nothing allows third-party apps to embed it | No |
| `NOT_VERIFIED` | Nothing checked yet | No |
| `TEST_STREAM` | Vendor-published sample for player QA. Not a TV channel | Yes |

Before a channel moves to `VERIFIED_AUTHORIZED`, record: rights holder, contact, document or licence link, date, regions, expiry, and whether a logo may be shown.

## 2. Test streams (player QA only)

| Catalog id | URL | Publisher | Terms / why it's usable |
|---|---|---|---|
| `test-apple-bipbop` | `https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_ts/master.m3u8` | Apple, "HTTP Live Streaming Examples" (developer.apple.com/streaming/examples) | Published by Apple as reference streams for developers testing HLS players. Multi-bitrate H.264/TS |
| `test-mux-bbb` | `https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8` | Mux public test streams | Content is *Big Buck Bunny* © Blender Foundation, CC BY 3.0 |

Both returned HTTP 200 on 2026-10-17. They are VOD streams, so the "live" UI is exercised with on-demand content. Before a store release, remove them or hide them behind a debug flag.

## 3. Broadcaster channels

| Channel | Status | Notes |
|---|---|---|
| Wataniya 1 | `NOT_VERIFIED` | Public broadcaster (Établissement de la Télévision Tunisienne) |
| Wataniya 2 | `NOT_VERIFIED` | Same |
| El Hiwar Ettounsi | `NOT_VERIFIED` | Private |
| Attessia TV | `NOT_VERIFIED` | Private |
| Nessma | `NOT_VERIFIED` | Private |
| Hannibal TV | `NOT_VERIFIED` | Private |
