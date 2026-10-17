import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';

import { CHANNEL_CARD_WIDTH, ChannelCard } from '@/components/channel/ChannelCard';
import { ChannelListItem } from '@/components/channel/ChannelListItem';
import { AppText } from '@/components/common/AppText';
import { Chip } from '@/components/common/Chip';
import { Screen, SCREEN_GUTTER } from '@/components/common/Screen';
import { TV_RAIL_WIDTH } from '@/components/tv/TVSideNav';
import { type Channel, CHANNEL_CATEGORIES, type ChannelCategory } from '@/domain/models/Channel';
import { filterChannels } from '@/domain/usecases/searchChannels';
import { useLibrary } from '@/features/library/LibraryProvider';
import { useChannels } from '@/hooks/useChannels';
import { useI18n } from '@/localization/i18n';
import { colors, radii, spacing } from '@/theme/tokens';
import { isTV } from '@/utils/platform';

const openPlayer = (c: Channel) => router.push({ pathname: '/player/[id]', params: { id: c.id } });
const TV_GRID_GAP = spacing.lg;

/** Stitch "Chaînes" (TV grid / phone list) with category chips. */
export default function ChannelsScreen() {
  const channels = useChannels();
  const { t } = useI18n();
  const { isFavorite, toggleFavorite } = useLibrary();
  const [category, setCategory] = useState<ChannelCategory | null>(null);
  const { width } = useWindowDimensions();

  const visible = filterChannels(channels ?? [], { category });
  const usedCategories = CHANNEL_CATEGORIES.filter((c) => (channels ?? []).some((ch) => ch.category === c));

  const countChip = channels ? (
    <View style={styles.countChip}>
      <AppText variant="meta" color={colors.gold}>
        {t.channelCount(channels.length)}
      </AppText>
    </View>
  ) : null;

  const chips = (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.chips, { paddingHorizontal: SCREEN_GUTTER }]}
    >
      <Chip label={t.all} selected={category === null} onPress={() => setCategory(null)} />
      {usedCategories.map((c) => (
        <Chip key={c} label={t.category[c]} selected={category === c} onPress={() => setCategory(c)} />
      ))}
    </ScrollView>
  );

  if (isTV) {
    const contentWidth = width - TV_RAIL_WIDTH - SCREEN_GUTTER * 2;
    const columns = Math.max(1, Math.floor((contentWidth + TV_GRID_GAP) / (CHANNEL_CARD_WIDTH + TV_GRID_GAP)));
    const cardWidth = (contentWidth - TV_GRID_GAP * (columns - 1)) / columns;
    return (
      <Screen title={t.allChannels} trailing={countChip}>
        {chips}
        <View style={[styles.grid, { paddingHorizontal: SCREEN_GUTTER }]}>
          {visible.map((channel, i) => (
            <ChannelCard
              key={channel.id}
              channel={channel}
              width={cardWidth}
              hasTVPreferredFocus={i === 0}
              onPress={() => openPlayer(channel)}
            />
          ))}
        </View>
      </Screen>
    );
  }

  return (
    <Screen title={t.nav.channels} trailing={countChip} scroll={false}>
      <View style={styles.phoneChips}>{chips}</View>
      <FlatList
        data={visible}
        keyExtractor={(c) => c.id}
        contentContainerStyle={[styles.list, { paddingHorizontal: SCREEN_GUTTER }]}
        renderItem={({ item }) => (
          <ChannelListItem
            channel={item}
            favorite={isFavorite(item.id)}
            onPress={() => openPlayer(item)}
            onToggleFavorite={() => toggleFavorite(item.id)}
          />
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  countChip: {
    borderWidth: 1,
    borderColor: 'rgba(228,194,133,0.4)',
    backgroundColor: 'rgba(93,69,20,0.35)',
    borderRadius: radii.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 2,
  },
  chips: { gap: spacing.sm, paddingVertical: isTV ? spacing.sm : 0 },
  phoneChips: { marginTop: spacing.lg, marginBottom: spacing.md },
  // Extra vertical padding leaves room for the 1.08 focus scale.
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: TV_GRID_GAP, paddingVertical: spacing.sm },
  list: { gap: spacing.md, paddingBottom: spacing.xl },
});
