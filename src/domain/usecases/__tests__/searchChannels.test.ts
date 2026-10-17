import { mockChannels } from '@/data/catalog/mockChannels';
import { filterChannels, normalizeForSearch } from '@/domain/usecases/searchChannels';

describe('normalizeForSearch', () => {
  it('strips Latin diacritics and case', () => {
    expect(normalizeForSearch('  Télé ÉTÉ ')).toBe('tele ete');
  });

  it('strips Arabic tashkeel/tatweel and unifies alef forms', () => {
    expect(normalizeForSearch('الوَطَنِيّـة')).toBe('الوطنية');
    expect(normalizeForSearch('أخبار')).toBe('اخبار');
  });
});

describe('filterChannels', () => {
  it('returns everything for an empty filter', () => {
    expect(filterChannels(mockChannels, {})).toHaveLength(mockChannels.length);
  });

  it('matches Latin names case/accents-insensitively', () => {
    expect(filterChannels(mockChannels, { query: 'HIWAR' }).map((c) => c.id)).toEqual([
      'elhiwar-ettounsi',
    ]);
  });

  it('matches Arabic names', () => {
    expect(filterChannels(mockChannels, { query: 'نسمة' }).map((c) => c.id)).toEqual(['nessma']);
  });

  it('matches monogram text', () => {
    expect(filterChannels(mockChannels, { query: 'at9' }).map((c) => c.id)).toEqual(['attessia']);
  });

  it('combines category and query', () => {
    expect(filterChannels(mockChannels, { query: 'wataniya', category: 'news' }).map((c) => c.id)).toEqual([
      'wataniya-1',
    ]);
  });
});
