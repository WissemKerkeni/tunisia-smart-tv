import { useEffect, useState } from 'react';

/** "HH:MM", 24h, refreshed every 30 s. */
export function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);
  // Hermes' Intl ignores the fr-TN locale (renders "12:08 AM"), so format 24h by hand.
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}
