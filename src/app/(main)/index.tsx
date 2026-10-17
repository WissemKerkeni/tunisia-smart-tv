import { router } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { ChannelRow, type ChannelRowItem } from '@/components/channel/ChannelRow';
import { FeaturedHero } from '@/components/channel/FeaturedHero';
import { AppText } from '@/components/common/AppText';
import { Screen, SCREEN_GUTTER } from '@/components/common/Screen';
import { type Channel, CHANNEL_CATEGORIES } from '@/domain/models/Channel';
import { useLibrary } from '@/features/library/LibraryProvider';
import { useChannels } from '@/hooks/useChannels';
import { useNow } from '@/hooks/useNow';
import { useI18n } from '@/localization/i18n';
import { colors, radii, spacing } from '@/theme/tokens';
import { isTV } from '@/utils/platform';

const openPlayer = (c: Channel) => router.push({ pathname: '/player/[id]', params: { id: c.id } });

/** Stitch "Accueil" (TV 1080p + phone): hero, continue watching, favorites, category rows. */
export default function HomeScreen() {
  const channels = useChannels();
  const { t } = useI18n();
  const { history, favorites, isFavorite, toggleFavorite } = useLibrary();
  const now = useNow();

  const byId = useMemo(() => new Map((channels ?? []).map((c) => [c.id, c])), [channels]);

  if (!channels) return <HomeSkeleton />;

  // Featured: last watched channel, else the first channel in the catalog.
  const featured = (history[0] && byId.get(history[0].channelId)) || channels[0];

  const recent: ChannelRowItem[] = history
    .map((h) => ({ h, channel: byId.get(h.channelId) }))
    .filter((x): x is { h: (typeof history)[number]; channel: Channel } => !!x.channel)
    .map(({ h, channel }) => ({ channel, subtitle: t.timeAgo(Math.floor((now - h.watchedAt) / 60000)) }));

  const favs: ChannelRowItem[] = favorites
    .map((id) => byId.get(id))
    .filter((c): c is Channel => !!c)
    .map((channel) => ({ channel }));

  const categoryRows = CHANNEL_CATEGORIES.map((category) => ({
    category,
    items: channels.filter((c) => c.category === category).map((channel) => ({ channel })),
  })).filter((r) => r.items.length > 0);

  return (
    <Screen hideHeader>
      {!isTV && (
        <View style={[styles.phoneHeader, { paddingHorizontal: SCREEN_GUTTER }]}>
          <View style={styles.logoTile}>
            <AppText variant="badge" color={colors.onAccent}>
              TV
            </AppText>
          </View>
          <AppText variant="section" style={styles.wordmark}>
            Tunisie<AppText variant="section" color={colors.accent} style={styles.wordmark}>TV</AppText>
          </AppText>
        </View>
      )}

      {featured && (
        <View style={{ paddingHorizontal: SCREEN_GUTTER }}>
          <FeaturedHero
            channel={featured}
            favorite={isFavorite(featured.id)}
            onWatch={() => openPlayer(featured)}
            onToggleFavorite={() => toggleFavorite(featured.id)}
          />
        </View>
      )}

      {recent.length > 0 && (
        <ChannelRow
          title={t.continueWatching}
          trailing={t.channelCount(recent.length)}
          items={recent}
          gutter={SCREEN_GUTTER}
          onSelect={openPlayer}
        />
      )}

      {favs.length > 0 && (
        <ChannelRow title={t.myFavorites} items={favs} gutter={SCREEN_GUTTER} onSelect={openPlayer} />
      )}

      {categoryRows.map((row) => (
        <ChannelRow
          key={row.category}
          title={t.category[row.category]}
          trailing={t.channelCount(row.items.length)}
          items={row.items}
          gutter={SCREEN_GUTTER}
          onSelect={openPlayer}
        />
      ))}
    </Screen>
  );
}

/** Loading: card-sized surface blocks, no shimmer (design-system.md §8). */
function HomeSkeleton() {
  return (
    <Screen hideHeader scroll={false}>
      <View style={{ paddingHorizontal: SCREEN_GUTTER, gap: spacing.xl }}>
        <View style={[styles.skeleton, { height: isTV ? 240 : 320 }]} />
        <View style={styles.skeletonRow}>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={[styles.skeleton, { width: 160, height: 150 }]} />
          ))}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  phoneHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  logoTile: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordmark: { fontSize: 24, lineHeight: 30 },
  skeleton: { backgroundColor: colors.surface2, borderRadius: radii.lg },
  skeletonRow: { flexDirection: 'row', gap: spacing.md, overflow: 'hidden' },
});
