import { useEvent, useEventListener } from 'expo';
import { type VideoSource, useVideoPlayer } from 'expo-video';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { type Channel, isPlayable } from '@/domain/models/Channel';
import { useLibrary } from '@/features/library/LibraryProvider';
import { useIsOnline } from '@/hooks/useNetworkStatus';
import { retryDelayMs } from '@/services/playback/retryPolicy';

/**
 * - `unavailable`: no authorized source, nothing is loaded
 * - `loading`: opening the stream or rebuffering
 * - `retrying`: an error happened, an automatic attempt is scheduled
 * - `offline` / `error`: automatic attempts are spent (or the device is offline); manual retry
 */
export type PlaybackState = 'unavailable' | 'loading' | 'playing' | 'paused' | 'retrying' | 'offline' | 'error';

function toSource(channel: Channel | null | undefined): VideoSource | null {
  if (!channel || !isPlayable(channel) || !channel.stream.url) return null;
  const contentType = channel.stream.format === 'progressive' ? 'progressive' : channel.stream.format;
  return {
    uri: channel.stream.url,
    contentType,
    metadata: { title: channel.name },
  };
}

interface RetryState {
  /** Source the counters belong to; switching channel resets them without an effect. */
  key: string | null;
  attempt: number;
  pending: boolean;
}

/** expo-video player bound to a channel, with automatic reconnection. */
export function usePlayback(channel: Channel | null | undefined) {
  const source = useMemo(() => toSource(channel), [channel]);
  const key = source && typeof source === 'object' && 'uri' in source ? (source.uri ?? null) : null;

  const player = useVideoPlayer(null, (p) => {
    p.keepScreenOnWhilePlaying = true;
    p.staysActiveInBackground = false;
  });
  const { status } = useEvent(player, 'statusChange', { status: player.status });
  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });
  const online = useIsOnline();
  const { recordWatch } = useLibrary();

  const [retry, setRetry] = useState<RetryState>({ key: null, attempt: 0, pending: false });
  const attempt = retry.key === key ? retry.attempt : 0;
  const pending = retry.key === key && retry.pending;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recordedFor = useRef<string | null>(null);

  const clearTimer = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };

  const load = useCallback(() => {
    if (!source) {
      player.replace(null);
      return;
    }
    player.replaceAsync(source).then(() => player.play(), () => undefined);
  }, [player, source]);

  // (Re)load whenever the channel changes. Zapping reuses the same player.
  useEffect(() => {
    clearTimer();
    load();
    return clearTimer;
  }, [load]);

  useEventListener(player, 'statusChange', ({ status: next }) => {
    if (next === 'readyToPlay') {
      clearTimer();
      setRetry({ key, attempt: 0, pending: false });
    } else if (next === 'error' && key) {
      const delay = retryDelayMs(attempt);
      if (delay === null) return;
      clearTimer();
      setRetry({ key, attempt, pending: true });
      timer.current = setTimeout(() => {
        timer.current = null;
        setRetry({ key, attempt: attempt + 1, pending: false });
        load();
      }, delay);
    }
  });

  // A channel counts as watched once it actually plays.
  useEventListener(player, 'playingChange', ({ isPlaying: playing }) => {
    if (playing && channel && recordedFor.current !== channel.id) {
      recordedFor.current = channel.id;
      recordWatch(channel.id);
    }
  });

  // Reconnect as soon as the network comes back after a failure.
  const wasOnline = useRef(online);
  useEffect(() => {
    const cameBack = wasOnline.current === false && online === true;
    wasOnline.current = online;
    if (cameBack && status === 'error' && !timer.current) load();
  }, [online, status, load]);

  const retryNow = useCallback(() => {
    clearTimer();
    setRetry({ key, attempt: 0, pending: false });
    load();
  }, [key, load]);

  const togglePlay = useCallback(() => {
    if (player.playing) player.pause();
    else player.play();
  }, [player]);

  let state: PlaybackState;
  if (!source) state = 'unavailable';
  else if (status === 'error') state = pending ? 'retrying' : online === false ? 'offline' : 'error';
  else if (status === 'readyToPlay') state = isPlaying ? 'playing' : 'paused';
  else state = 'loading';

  return { player, state, attempt, retry: retryNow, togglePlay };
}
