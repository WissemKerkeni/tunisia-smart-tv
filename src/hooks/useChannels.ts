import { useEffect, useState } from 'react';

import { channelRepository } from '@/data/repositories/ChannelRepository';
import type { Channel } from '@/domain/models/Channel';

export function useChannels() {
  const [channels, setChannels] = useState<readonly Channel[] | null>(null);
  useEffect(() => {
    let alive = true;
    channelRepository.getAll().then((all) => alive && setChannels(all));
    return () => {
      alive = false;
    };
  }, []);
  return channels;
}

/** `undefined` while loading, `null` when not found. */
export function useChannel(id: string | undefined): Channel | null | undefined {
  const [result, setResult] = useState<{ id: string; channel: Channel | null } | null>(null);
  useEffect(() => {
    if (!id) return;
    let alive = true;
    channelRepository.getById(id).then((c) => alive && setResult({ id, channel: c ?? null }));
    return () => {
      alive = false;
    };
  }, [id]);
  if (!id) return null;
  return result?.id === id ? result.channel : undefined;
}
