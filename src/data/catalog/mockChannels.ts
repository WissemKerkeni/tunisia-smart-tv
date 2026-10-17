import Constants from 'expo-constants';

import type { Channel } from '@/domain/models/Channel';

/**
 * Channel catalog. Sources and their status: docs/stream-rights-checklist.md §3.
 * - `hls` URLs are the streams the broadcasters publish on their own servers.
 *   Rights for third-party apps are unconfirmed, so they play in dev/QA builds
 *   only and are stripped from store builds (see `storeSafe` below).
 * - `youtube` URLs are the broadcasters' own YouTube live pages, opened in the
 *   YouTube app. Nothing is re-streamed, so they ship in every build.
 * - `testStreamChannels` (numbers 90+) point at vendor-published HLS test
 *   samples so the player can be exercised. They are not TV channels.
 * - No broadcaster logos: original monogram tiles (see docs/design-system.md §6).
 */
const youtubeLive = (channelId: string) => `https://www.youtube.com/channel/${channelId}/live`;

export const broadcasterChannels: readonly Channel[] = [
  {
    id: 'wataniya-1',
    number: 1,
    name: 'Wataniya 1',
    nameAr: 'الوطنية 1',
    category: 'news',
    logo: { kind: 'monogram', text: 'W1', colors: ['#5A0A10', '#1F1F22'] },
    stream: { url: 'https://sw1.tanitweb.net/TunisiaTV/_definst_/watania1/playlist.m3u8', format: 'hls' },
    authorizationStatus: 'OFFICIAL_SOURCE_PERMISSION_UNCONFIRMED',
    languages: ['ar', 'fr'],
    description: 'Télévision publique nationale',
    descriptionAr: 'التلفزة العمومية الوطنية',
  },
  {
    id: 'wataniya-2',
    number: 2,
    name: 'Wataniya 2',
    nameAr: 'الوطنية 2',
    category: 'regional',
    logo: { kind: 'monogram', text: 'W2', colors: ['#1B2A44', '#1F1F22'] },
    stream: { url: 'https://sw1.tanitweb.net/TunisiaTV/_definst_/watania2/playlist.m3u8', format: 'hls' },
    authorizationStatus: 'OFFICIAL_SOURCE_PERMISSION_UNCONFIRMED',
    languages: ['ar'],
    description: 'Chaîne publique · régions',
    descriptionAr: 'القناة العمومية · الجهات',
  },
  {
    id: 'elhiwar-ettounsi',
    number: 3,
    name: 'El Hiwar Ettounsi',
    nameAr: 'الحوار التونسي',
    category: 'entertainment',
    logo: { kind: 'monogram', text: 'EH', colors: ['#14304F', '#1F1F22'] },
    stream: { url: youtubeLive('UCXzmMkXaHxMVlutDBD8goHA'), format: 'youtube' },
    authorizationStatus: 'OFFICIAL_SOURCE_PERMISSION_UNCONFIRMED',
    languages: ['ar'],
    description: 'Variétés & divertissement',
    descriptionAr: 'منوعات وترفيه',
  },
  {
    id: 'attessia',
    number: 4,
    name: 'Attessia TV',
    nameAr: 'التاسعة',
    category: 'entertainment',
    logo: { kind: 'monogram', text: 'AT9', colors: ['#4A0D12', '#1F1F22'] },
    stream: { url: youtubeLive('UCQS3ejF2jBAhwmbGD9Q3oeA'), format: 'youtube' },
    authorizationStatus: 'OFFICIAL_SOURCE_PERMISSION_UNCONFIRMED',
    languages: ['ar'],
    description: 'Talk-shows & séries',
    descriptionAr: 'برامج حوارية ومسلسلات',
  },
  {
    id: 'nessma',
    number: 5,
    name: 'Nessma',
    nameAr: 'نسمة',
    category: 'entertainment',
    logo: { kind: 'monogram', text: 'NS', colors: ['#0F3B2E', '#1F1F22'] },
    stream: { url: youtubeLive('UC-48PCT3flS86JkLzxlTA9g'), format: 'youtube' },
    authorizationStatus: 'OFFICIAL_SOURCE_PERMISSION_UNCONFIRMED',
    languages: ['ar', 'fr'],
    description: 'Divertissement & séries',
    descriptionAr: 'ترفيه ومسلسلات',
  },
  {
    id: 'hannibal',
    number: 6,
    name: 'Hannibal TV',
    nameAr: 'حنبعل',
    category: 'news',
    logo: { kind: 'monogram', text: 'HTV', colors: ['#4A3510', '#1F1F22'] },
    stream: { url: youtubeLive('UCMowjs_MJ-oIWEeHUu3DrOQ'), format: 'youtube' },
    authorizationStatus: 'OFFICIAL_SOURCE_PERMISSION_UNCONFIRMED',
    languages: ['ar'],
    description: 'Actualités & débats',
    descriptionAr: 'أخبار ونقاشات',
  },
  {
    id: 'telvza',
    number: 7,
    name: 'Telvza TV',
    nameAr: 'تلفزة تي في',
    category: 'entertainment',
    logo: { kind: 'monogram', text: 'TZ', colors: ['#3A1F4A', '#1F1F22'] },
    stream: { url: youtubeLive('UCluj6itDtPuj8wUT7VlNLAQ'), format: 'youtube' },
    authorizationStatus: 'OFFICIAL_SOURCE_PERMISSION_UNCONFIRMED',
    languages: ['ar'],
    description: 'Divertissement & société',
    descriptionAr: 'ترفيه ومجتمع',
  },
  {
    id: 'zitouna',
    number: 8,
    name: 'Zitouna TV',
    nameAr: 'الزيتونة',
    category: 'religion',
    logo: { kind: 'monogram', text: 'ZT', colors: ['#24401A', '#1F1F22'] },
    stream: { url: youtubeLive('UCruhKc73GretC8MZASMaobA'), format: 'youtube' },
    authorizationStatus: 'OFFICIAL_SOURCE_PERMISSION_UNCONFIRMED',
    languages: ['ar'],
    description: 'Religion & société',
    descriptionAr: 'دين ومجتمع',
  },
  {
    id: 'al-insen',
    number: 9,
    name: 'Al Insen TV',
    nameAr: 'الإنسان',
    category: 'religion',
    logo: { kind: 'monogram', text: 'IN', colors: ['#1A3A40', '#1F1F22'] },
    stream: { url: youtubeLive('UCHGo-gQ_H6dnFJ9XwUxgTsA'), format: 'youtube' },
    authorizationStatus: 'OFFICIAL_SOURCE_PERMISSION_UNCONFIRMED',
    languages: ['ar'],
    description: 'Religion & famille',
    descriptionAr: 'دين وأسرة',
  },
  {
    id: 'al-janoubiya',
    number: 10,
    name: 'Al Janoubiya TV',
    nameAr: 'الجنوبية',
    category: 'regional',
    logo: { kind: 'monogram', text: 'JN', colors: ['#4A2A10', '#1F1F22'] },
    stream: { url: youtubeLive('UCMjIC5ZehZ7J7DqnpzU6hFA'), format: 'youtube' },
    authorizationStatus: 'OFFICIAL_SOURCE_PERMISSION_UNCONFIRMED',
    languages: ['ar'],
    description: 'Chaîne du Sud tunisien',
    descriptionAr: 'قناة الجنوب التونسي',
  },
  {
    id: 'tunisna',
    number: 11,
    name: 'Tunisna TV',
    nameAr: 'تونسنا',
    category: 'entertainment',
    logo: { kind: 'monogram', text: 'TN', colors: ['#40101A', '#1F1F22'] },
    stream: { url: youtubeLive('UCefcFOtmSMDA4H8fGmSFvkQ'), format: 'youtube' },
    authorizationStatus: 'OFFICIAL_SOURCE_PERMISSION_UNCONFIRMED',
    languages: ['ar'],
    description: 'Généraliste',
    descriptionAr: 'قناة عامة',
  },
  {
    id: 'mosaique-fm',
    number: 12,
    name: 'Mosaïque FM',
    nameAr: 'موزاييك أف أم',
    category: 'news',
    logo: { kind: 'monogram', text: 'MFM', colors: ['#10304A', '#1F1F22'] },
    stream: { url: 'https://webcam.mosaiquefm.net/mosatv/_definst_/studio/playlist.m3u8', format: 'hls' },
    authorizationStatus: 'OFFICIAL_SOURCE_PERMISSION_UNCONFIRMED',
    languages: ['ar', 'fr'],
    description: 'Radio filmée · info & débats',
    descriptionAr: 'إذاعة مصوّرة · أخبار ونقاشات',
  },
  {
    id: 'diwan-fm',
    number: 13,
    name: 'Diwan FM',
    nameAr: 'ديوان أف أم',
    category: 'entertainment',
    logo: { kind: 'monogram', text: 'DFM', colors: ['#3A2A10', '#1F1F22'] },
    stream: { url: youtubeLive('UCOvTt3b378hpuUXgb46UdMQ'), format: 'youtube' },
    authorizationStatus: 'OFFICIAL_SOURCE_PERMISSION_UNCONFIRMED',
    languages: ['ar'],
    description: 'Radio filmée · divertissement',
    descriptionAr: 'إذاعة مصوّرة · ترفيه',
  },
  {
    id: 'ifm',
    number: 14,
    name: 'IFM',
    nameAr: 'إي أف أم',
    category: 'entertainment',
    logo: { kind: 'monogram', text: 'IFM', colors: ['#102A3A', '#1F1F22'] },
    stream: { url: youtubeLive('UCvPW0VhnTcxYjWIxCvMlw2Q'), format: 'youtube' },
    authorizationStatus: 'OFFICIAL_SOURCE_PERMISSION_UNCONFIRMED',
    languages: ['ar'],
    description: 'Radio filmée · divertissement',
    descriptionAr: 'إذاعة مصوّرة · ترفيه',
  },
  {
    id: 'jawhara-fm',
    number: 15,
    name: 'Jawhara FM',
    nameAr: 'جوهرة أف أم',
    category: 'regional',
    logo: { kind: 'monogram', text: 'JFM', colors: ['#2A1A40', '#1F1F22'] },
    stream: { url: youtubeLive('UCXowBzuwUrjfRt68d5VphAg'), format: 'youtube' },
    authorizationStatus: 'OFFICIAL_SOURCE_PERMISSION_UNCONFIRMED',
    languages: ['ar'],
    description: 'Radio filmée · Sahel',
    descriptionAr: 'إذاعة مصوّرة · الساحل',
  },
];

/**
 * Player QA only. Sources and terms: docs/stream-rights-checklist.md §2.
 * Shipped in dev and QA builds (`extra.includeTestStreams`, set by
 * scripts/build-apk.sh), never in store builds (scripts/build-aab.sh).
 */
export const testStreamChannels: readonly Channel[] = [
  {
    id: 'test-apple-bipbop',
    number: 90,
    name: 'Flux de test HLS',
    nameAr: 'بث تجريبي HLS',
    category: 'entertainment',
    logo: { kind: 'monogram', text: 'T1', colors: ['#2A2A2D', '#1F1F22'] },
    stream: {
      url: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_ts/master.m3u8',
      format: 'hls',
    },
    authorizationStatus: 'TEST_STREAM',
    languages: ['en'],
    description: 'Échantillon Apple (multi-débit)',
    descriptionAr: 'عيّنة من Apple (جودات متعددة)',
  },
  {
    id: 'test-mux-bbb',
    number: 91,
    name: 'Flux de test 2',
    nameAr: 'بث تجريبي 2',
    category: 'entertainment',
    logo: { kind: 'monogram', text: 'T2', colors: ['#2A2A2D', '#1F1F22'] },
    stream: { url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', format: 'hls' },
    authorizationStatus: 'TEST_STREAM',
    languages: ['en'],
    description: 'Big Buck Bunny (Mux, CC BY)',
    descriptionAr: 'Big Buck Bunny (Mux، CC BY)',
  },
];

export const INCLUDE_TEST_STREAMS = __DEV__ || Constants.expoConfig?.extra?.includeTestStreams === true;

/** Store builds keep YouTube links but drop in-app streams whose rights aren't confirmed. */
export function storeSafe(channel: Channel): Channel {
  const keep =
    channel.stream.format === 'youtube' ||
    channel.authorizationStatus === 'VERIFIED_AUTHORIZED' ||
    channel.authorizationStatus === 'TEST_STREAM';
  return keep ? channel : { ...channel, stream: { ...channel.stream, url: null } };
}

export const mockChannels: readonly Channel[] = INCLUDE_TEST_STREAMS
  ? [...broadcasterChannels, ...testStreamChannels]
  : broadcasterChannels.map(storeSafe);
