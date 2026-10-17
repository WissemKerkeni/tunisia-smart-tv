import Constants from 'expo-constants';

import type { Channel } from '@/domain/models/Channel';

/**
 * MOCK CATALOG. Channel names are used for realistic UI only.
 * - No real stream URLs for broadcasters: no source has been verified as
 *   authorized (see docs/stream-rights-checklist.md).
 * - `testStreamChannels` (numbers 90+) point at vendor-published HLS test
 *   samples so the player can be exercised. They are not TV channels.
 * - No broadcaster logos: original monogram tiles (see docs/design-system.md §6).
 */
export const broadcasterChannels: readonly Channel[] = [
  {
    id: 'wataniya-1',
    number: 1,
    name: 'Wataniya 1',
    nameAr: 'الوطنية 1',
    category: 'news',
    logo: { kind: 'monogram', text: 'W1', colors: ['#5A0A10', '#1F1F22'] },
    stream: { url: null, format: 'hls' },
    authorizationStatus: 'NOT_VERIFIED',
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
    stream: { url: null, format: 'hls' },
    authorizationStatus: 'NOT_VERIFIED',
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
    stream: { url: null, format: 'hls' },
    authorizationStatus: 'NOT_VERIFIED',
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
    stream: { url: null, format: 'hls' },
    authorizationStatus: 'NOT_VERIFIED',
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
    stream: { url: null, format: 'hls' },
    authorizationStatus: 'NOT_VERIFIED',
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
    stream: { url: null, format: 'hls' },
    authorizationStatus: 'NOT_VERIFIED',
    languages: ['ar'],
    description: 'Actualités & débats',
    descriptionAr: 'أخبار ونقاشات',
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

export const mockChannels: readonly Channel[] = INCLUDE_TEST_STREAMS
  ? [...broadcasterChannels, ...testStreamChannels]
  : broadcasterChannels;
