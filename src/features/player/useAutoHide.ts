import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Player chrome visibility. `show()` (any remote key / tap) makes it visible
 * and restarts the countdown. It only hides while `canHide` is true (i.e. the
 * stream is playing); otherwise the countdown simply restarts.
 */
export function useAutoHide(canHide: boolean, delayMs = 5_000) {
  const [visible, setVisible] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const canHideRef = useRef(canHide);

  useEffect(() => {
    canHideRef.current = canHide;
  }, [canHide]);

  const schedule = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    const tick = () => {
      if (canHideRef.current) setVisible(false);
      else timer.current = setTimeout(tick, delayMs);
    };
    timer.current = setTimeout(tick, delayMs);
  }, [delayMs]);

  const show = useCallback(() => {
    setVisible(true);
    schedule();
  }, [schedule]);

  const hide = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setVisible(false);
  }, []);

  useEffect(() => {
    schedule();
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [schedule]);

  return { visible: visible || !canHide, show, hide };
}
