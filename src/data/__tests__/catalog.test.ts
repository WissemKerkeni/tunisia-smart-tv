import { broadcasterChannels, mockChannels, storeSafe, testStreamChannels } from '@/data/catalog/mockChannels';
import { LocalChannelRepository } from '@/data/repositories/ChannelRepository';
import { type Channel, externalLiveUrl, isPlayable } from '@/domain/models/Channel';

describe('mock catalog', () => {
  it('has unique ids and numbers', () => {
    expect(new Set(mockChannels.map((c) => c.id)).size).toBe(mockChannels.length);
    expect(new Set(mockChannels.map((c) => c.number)).size).toBe(mockChannels.length);
  });

  it('keeps test streams separate from broadcaster channels', () => {
    expect(testStreamChannels.every((c) => c.authorizationStatus === 'TEST_STREAM')).toBe(true);
    expect(broadcasterChannels.some((c) => c.authorizationStatus === 'TEST_STREAM')).toBe(false);
    const all = [...broadcasterChannels, ...testStreamChannels];
    expect(new Set(all.map((c) => c.id)).size).toBe(all.length);
  });

  it('contains no stream URLs for unchecked channels', () => {
    for (const c of mockChannels) {
      if (c.authorizationStatus === 'NOT_VERIFIED') expect(c.stream.url).toBeNull();
    }
  });

  it('gives every broadcaster channel an https source', () => {
    for (const c of broadcasterChannels) expect(c.stream.url).toMatch(/^https:\/\//);
  });

  it('points YouTube sources at a channel live page', () => {
    for (const c of broadcasterChannels.filter((ch) => ch.stream.format === 'youtube')) {
      expect(c.stream.url).toMatch(/^https:\/\/www\.youtube\.com\/channel\/UC[\w-]{22}\/live$/);
    }
  });

  it('store builds keep YouTube links and drop unconfirmed in-app streams', () => {
    for (const c of broadcasterChannels.map(storeSafe)) {
      if (c.stream.format === 'youtube') expect(externalLiveUrl(c)).not.toBeNull();
      else if (c.authorizationStatus !== 'VERIFIED_AUTHORIZED') expect(isPlayable(c)).toBe(false);
    }
  });
});

describe('isPlayable', () => {
  const base = mockChannels[0];
  const withStatus = (s: Channel['authorizationStatus'], url: string | null): Channel => ({
    ...base,
    authorizationStatus: s,
    stream: { ...base.stream, url },
  });

  it('requires both a URL and an allowed status', () => {
    expect(isPlayable(withStatus('VERIFIED_AUTHORIZED', 'https://example.test/a.m3u8'))).toBe(true);
    expect(isPlayable(withStatus('TEST_STREAM', 'https://example.test/a.m3u8'))).toBe(true);
    expect(isPlayable(withStatus('OFFICIAL_SOURCE_PERMISSION_UNCONFIRMED', 'https://example.test/a.m3u8'))).toBe(true);
    expect(isPlayable(withStatus('NOT_VERIFIED', 'https://example.test/a.m3u8'))).toBe(false);
    expect(isPlayable(withStatus('VERIFIED_AUTHORIZED', null))).toBe(false);
  });

  it('never plays YouTube sources in-app', () => {
    const yt: Channel = {
      ...base,
      authorizationStatus: 'VERIFIED_AUTHORIZED',
      stream: { url: 'https://www.youtube.com/channel/UC0000000000000000000000/live', format: 'youtube' },
    };
    expect(isPlayable(yt)).toBe(false);
    expect(externalLiveUrl(yt)).toBe(yt.stream.url);
    expect(externalLiveUrl(withStatus('TEST_STREAM', 'https://example.test/a.m3u8'))).toBeNull();
  });
});

describe('LocalChannelRepository', () => {
  const repo = new LocalChannelRepository();

  it('returns channels sorted by number', async () => {
    const all = await repo.getAll();
    expect(all.map((c) => c.number)).toEqual([...all.map((c) => c.number)].sort((a, b) => a - b));
  });

  it('finds by id and category', async () => {
    expect((await repo.getById('nessma'))?.name).toBe('Nessma');
    expect(await repo.getById('missing')).toBeUndefined();
    expect((await repo.getByCategory('news')).every((c) => c.category === 'news')).toBe(true);
  });
});
