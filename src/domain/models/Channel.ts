/**
 * Channel model. Kept free of UI concerns so authorized sources can be added
 * to the catalog later without touching screens.
 */

export type ChannelCategory =
  | 'news'
  | 'entertainment'
  | 'sports'
  | 'religion'
  | 'regional'
  | 'kids';

export const CHANNEL_CATEGORIES: readonly ChannelCategory[] = [
  'news',
  'entertainment',
  'sports',
  'religion',
  'regional',
  'kids',
];

/**
 * Mirrors docs/stream-rights-checklist.md statuses.
 * `TEST_STREAM` marks a vendor-published sample used only to exercise the player.
 */
export type AuthorizationStatus =
  | 'VERIFIED_AUTHORIZED'
  | 'OFFICIAL_SOURCE_PERMISSION_UNCONFIRMED'
  | 'NOT_VERIFIED'
  | 'TEST_STREAM';

export type ChannelLogo =
  | { kind: 'monogram'; text: string; colors: readonly [string, string] }
  | { kind: 'image'; uri: string };

/** `youtube`: the broadcaster's own YouTube live page, opened outside the app (never played in-app). */
export type StreamFormat = 'hls' | 'dash' | 'progressive' | 'youtube';

export interface ChannelStream {
  /** `null` when no source is known. The player shows an "unavailable" state. */
  url: string | null;
  format: StreamFormat;
}

export type LanguageCode = 'ar' | 'fr' | 'en';

export interface ChannelAvailability {
  /** ISO 3166-1 alpha-2 codes where the source is known to be viewable. */
  regions?: readonly string[];
  note?: string;
}

export interface Channel {
  id: string;
  /** Display number, e.g. "CH 01". */
  number: number;
  name: string;
  /** Optional Arabic display name. */
  nameAr?: string;
  category: ChannelCategory;
  logo: ChannelLogo;
  stream: ChannelStream;
  authorizationStatus: AuthorizationStatus;
  languages?: readonly LanguageCode[];
  availability?: ChannelAvailability;
  description?: string;
  /** Optional Arabic description. */
  descriptionAr?: string;
}

/**
 * True only when the app is allowed to attempt in-app playback.
 * `OFFICIAL_SOURCE_PERMISSION_UNCONFIRMED` URLs only reach this point in dev/QA
 * builds: the catalog strips them from store builds (src/data/catalog/mockChannels.ts).
 */
export function isPlayable(channel: Channel): boolean {
  return (
    channel.stream.url !== null &&
    channel.stream.format !== 'youtube' &&
    channel.authorizationStatus !== 'NOT_VERIFIED'
  );
}

/** URL of the broadcaster's own live page, opened in the YouTube app instead of the in-app player. */
export function externalLiveUrl(channel: Channel): string | null {
  return channel.stream.format === 'youtube' ? channel.stream.url : null;
}
