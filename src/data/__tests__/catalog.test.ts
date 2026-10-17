import { mockChannels } from '@/data/catalog/mockChannels';
import { LocalChannelRepository } from '@/data/repositories/ChannelRepository';
import { type Channel, isPlayable } from '@/domain/models/Channel';

describe('mock catalog', () => {
  it('has unique ids and numbers', () => {
    expect(new Set(mockChannels.map((c) => c.id)).size).toBe(mockChannels.length);
    expect(new Set(mockChannels.map((c) => c.number)).size).toBe(mockChannels.length);
  });

  it('contains no stream URLs for unverified channels', () => {
    for (const c of mockChannels) {
      if (c.authorizationStatus !== 'VERIFIED_AUTHORIZED' && c.authorizationStatus !== 'TEST_STREAM') {
        expect(c.stream.url).toBeNull();
      }
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
    expect(isPlayable(withStatus('OFFICIAL_SOURCE_PERMISSION_UNCONFIRMED', 'https://example.test/a.m3u8'))).toBe(false);
    expect(isPlayable(withStatus('VERIFIED_AUTHORIZED', null))).toBe(false);
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
