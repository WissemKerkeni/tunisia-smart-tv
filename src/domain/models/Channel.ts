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

export type StreamFormat = 'hls' | 'dash' | 'progressive';

export interface ChannelStream {
  /** `null` until an authorized source exists. The player shows an "unavailable" state. */
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
}

/** True only when the app is allowed to attempt playback. */
export function isPlayable(channel: Channel): boolean {
  return (
    channel.stream.url !== null &&
    (channel.authorizationStatus === 'VERIFIED_AUTHORIZED' ||
      channel.authorizationStatus === 'TEST_STREAM')
  );
}
