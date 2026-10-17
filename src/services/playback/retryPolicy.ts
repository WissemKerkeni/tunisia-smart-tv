/**
 * Automatic reconnection after a playback error: a few attempts with
 * exponential backoff, then the player shows an error card with a manual
 * "Réessayer" button. A manual retry starts the sequence again.
 */
export const MAX_AUTO_RETRIES = 3;

const BASE_DELAY_MS = 2_000;
const MAX_DELAY_MS = 15_000;

/** Delay before automatic attempt `attempt` (0-based), or `null` once auto retries are spent. */
export function retryDelayMs(attempt: number): number | null {
  if (attempt < 0 || attempt >= MAX_AUTO_RETRIES) return null;
  return Math.min(BASE_DELAY_MS * 2 ** attempt, MAX_DELAY_MS);
}
