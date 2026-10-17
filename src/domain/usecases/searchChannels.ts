import type { Channel, ChannelCategory } from '@/domain/models/Channel';

/** Lower-case, strip Latin diacritics and Arabic tashkeel/tatweel. */
export function normalizeForSearch(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[ً-ٰٟـ]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .toLowerCase()
    .trim();
}

export interface ChannelFilter {
  query?: string;
  category?: ChannelCategory | null;
}

export function filterChannels(channels: readonly Channel[], filter: ChannelFilter): Channel[] {
  const q = normalizeForSearch(filter.query ?? '');
  return channels.filter((c) => {
    if (filter.category && c.category !== filter.category) return false;
    if (!q) return true;
    const haystack = [c.name, c.nameAr ?? '', c.logo.kind === 'monogram' ? c.logo.text : '']
      .map(normalizeForSearch)
      .join(' ');
    return haystack.includes(q);
  });
}
