import { useRef } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { useTVScrollTo } from '@/components/tv/TVScroll';
import type { Channel } from '@/domain/models/Channel';
import { colors, spacing } from '@/theme/tokens';
import { isTV } from '@/utils/platform';

import { ChannelCard } from './ChannelCard';

export interface ChannelRowItem {
  channel: Channel;
  subtitle?: string;
}

/** Section header + horizontal row of channel cards (Stitch home rows). */
export function ChannelRow({
  title,
  trailing,
  items,
  gutter,
  onSelect,
  preferFirstFocus,
}: {
  title: string;
  trailing?: string;
  items: readonly ChannelRowItem[];
  gutter: number;
  onSelect: (channel: Channel) => void;
  preferFirstFocus?: boolean;
}) {
  const scrollTo = useTVScrollTo();
  const y = useRef(0);
  return (
    <View style={styles.row} onLayout={(e) => (y.current = e.nativeEvent.layout.y)}>
      <View style={[styles.header, { paddingHorizontal: gutter }]}>
        <AppText variant="section">{title}</AppText>
        {trailing && (
          <View style={styles.countChip}>
            <AppText variant="meta" color={colors.textSecondary}>
              {trailing}
            </AppText>
          </View>
        )}
      </View>
      <FlatList
        horizontal
        data={items}
        keyExtractor={(i) => i.channel.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingHorizontal: gutter }]}
        renderItem={({ item, index }) => (
          <ChannelCard
            channel={item.channel}
            subtitle={item.subtitle}
            hasTVPreferredFocus={preferFirstFocus && index === 0}
            onFocus={() => scrollTo(y.current - spacing.xl)}
            onPress={() => onSelect(item.channel)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { gap: isTV ? spacing.sm : spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  countChip: {
    backgroundColor: colors.surface2,
    borderRadius: 999,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 2,
  },
  // Vertical padding leaves room for the 1.08 focus scale + ring.
  content: { gap: isTV ? spacing.lg : spacing.md, paddingVertical: isTV ? spacing.md : 0 },
});
