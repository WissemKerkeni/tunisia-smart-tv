import { mockChannels } from '@/data/catalog/mockChannels';
import type { Channel, ChannelCategory } from '@/domain/models/Channel';
import { filterChannels } from '@/domain/usecases/searchChannels';

export interface ChannelRepository {
  getAll(): Promise<readonly Channel[]>;
  getById(id: string): Promise<Channel | undefined>;
  getByCategory(category: ChannelCategory): Promise<Channel[]>;
  search(query: string, category?: ChannelCategory | null): Promise<Channel[]>;
}

/** Local catalog. Swap for a remote implementation once authorized sources exist. */
export class LocalChannelRepository implements ChannelRepository {
  constructor(private readonly channels: readonly Channel[] = mockChannels) {}

  async getAll() {
    return [...this.channels].sort((a, b) => a.number - b.number);
  }

  async getById(id: string) {
    return this.channels.find((c) => c.id === id);
  }

  async getByCategory(category: ChannelCategory) {
    return filterChannels(await this.getAll(), { category });
  }

  async search(query: string, category: ChannelCategory | null = null) {
    return filterChannels(await this.getAll(), { query, category });
  }
}

export const channelRepository: ChannelRepository = new LocalChannelRepository();
