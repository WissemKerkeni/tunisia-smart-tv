import { router } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { ChannelCard } from '@/components/channel/ChannelCard';
import { ChannelRow } from '@/components/channel/ChannelRow';
import { AppText } from '@/components/common/AppText';
import { EmptyState } from '@/components/common/EmptyState';
import { Screen, SCREEN_GUTTER } from '@/components/common/Screen';
import type { Channel } from '@/domain/models/Channel';
import { useLibrary } from '@/features/library/LibraryProvider';
import { useChannels } from '@/hooks/useChannels';
import { useNow } from '@/hooks/useNow';
import { useI18n } from '@/localization/i18n';
import { colors, spacing } from '@/theme/tokens';
import { isTV } from '@/utils/platform';

const openPlayer = (c: Channel) => router.push({ pathname: '/player/[id]', params: { id: c.id } });

/** Stitch "Favoris & Paramètres" (favorites half): favorites grid + recently watched. */
export default function FavoritesScreen() {
  const channels = useChannels();
  const { t } = useI18n();
  const { favorites, history } = useLibrary();
  const now = useNow();
  const byId = useMemo(() => new Map((channels ?? []).map((c) => [c.id, c])), [channels]);

  const favChannels = favorites.map((id) => byId.get(id)).filter((c): c is Channel => !!c);
  const recent = history
    .map((h) => {
      const channel = byId.get(h.channelId);
      return channel ? { channel, subtitle: t.timeAgo(Math.floor((now - h.watchedAt) / 60000)) } : null;
    })
    .filter((x): x is { channel: Channel; subtitle: string } => !!x);

  return (
    <Screen
      title={t.myFavorites}
      trailing={
        favChannels.length > 0 ? (
          <AppText variant="meta" color={colors.textSecondary}>
            {t.channelCount(favChannels.length)}
          </AppText>
        ) : undefined
      }
    >
      <View style={{ paddingHorizontal: SCREEN_GUTTER }}>
        {favChannels.length === 0 ? (
          <EmptyState icon="favorite-border" title={t.noFavoritesTitle} hint={t.noFavoritesHint} />
        ) : (
          <View style={styles.grid}>
            {favChannels.map((c, i) => (
              <ChannelCard
                key={c.id}
                channel={c}
                width={isTV ? undefined : '47%'}
                hasTVPreferredFocus={i === 0}
                onPress={() => openPlayer(c)}
              />
            ))}
          </View>
        )}
      </View>

      {recent.length > 0 ? (
        <ChannelRow title={t.recentlyWatched} items={recent} gutter={SCREEN_GUTTER} onSelect={openPlayer} />
      ) : (
        <View style={{ paddingHorizontal: SCREEN_GUTTER, gap: spacing.sm }}>
          <AppText variant="section">{t.recentlyWatched}</AppText>
          <AppText variant="meta" color={colors.textSecondary}>
            {t.noHistory}
          </AppText>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: isTV ? spacing.lg : spacing.md, paddingVertical: isTV ? spacing.sm : 0 },
});
