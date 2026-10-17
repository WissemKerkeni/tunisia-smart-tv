import { isRTLLocale, resolveLocale } from '@/localization/i18n';
import { strings } from '@/localization/strings';

describe('resolveLocale', () => {
  it('follows the device for "system"', () => {
    expect(resolveLocale('system', 'ar')).toBe('ar');
    expect(resolveLocale('system', 'fr')).toBe('fr');
  });

  it('uses the explicit choice otherwise', () => {
    expect(resolveLocale('fr', 'ar')).toBe('fr');
    expect(resolveLocale('ar', 'fr')).toBe('ar');
  });

  it('marks only Arabic as RTL', () => {
    expect(isRTLLocale('ar')).toBe(true);
    expect(isRTLLocale('fr')).toBe(false);
  });
});

describe('strings', () => {
  // Every key in French must exist in Arabic with the same shape (functions stay functions).
  const shape = (o: object): unknown =>
    Object.fromEntries(
      Object.entries(o).map(([k, v]) => [k, v !== null && typeof v === 'object' ? shape(v) : typeof v]),
    );

  it('Arabic covers every French key', () => {
    expect(shape(strings.ar)).toEqual(shape(strings.fr));
  });
});

describe('Arabic channel count', () => {
  it('uses the dual and plural forms', () => {
    expect(strings.ar.channelCount(1)).toBe('قناة واحدة');
    expect(strings.ar.channelCount(2)).toBe('قناتان');
    expect(strings.ar.channelCount(3)).toBe('3 قنوات');
    expect(strings.ar.channelCount(11)).toBe('11 قناة');
  });
});
