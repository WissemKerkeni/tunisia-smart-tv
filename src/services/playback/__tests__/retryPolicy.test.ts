import { MAX_AUTO_RETRIES, retryDelayMs } from '@/services/playback/retryPolicy';

describe('retryDelayMs', () => {
  it('backs off exponentially', () => {
    expect(retryDelayMs(0)).toBe(2_000);
    expect(retryDelayMs(1)).toBe(4_000);
    expect(retryDelayMs(2)).toBe(8_000);
  });

  it('stops after the automatic attempts', () => {
    expect(retryDelayMs(MAX_AUTO_RETRIES)).toBeNull();
    expect(retryDelayMs(-1)).toBeNull();
  });
});
