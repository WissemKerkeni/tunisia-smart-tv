import { ScrollView, StyleSheet, View } from 'react-native';

import { channelTitle } from '@/components/channel/ChannelCard';
import { ChannelMonogram } from '@/components/channel/ChannelMonogram';
import { AppText } from '@/components/common/AppText';
import { Focusable } from '@/components/tv/Focusable';
import { type Channel, isPlayable } from '@/domain/models/Channel';
import { useI18n } from '@/localization/i18n';
import { colors, radii, spacing } from '@/theme/tokens';
import { isTV } from '@/utils/platform';

const TILE_WIDTH = isTV ? 184 : 156;

/** Stitch "Chaînes en direct · Zapping rapide" strip. The current channel has a red underline. */
export function ZapStrip({
  channels,
  currentId,
  onSelect,
}: {
  channels: readonly Channel[];
  currentId: string;
  onSelect: (channel: Channel) => void;
}) {
  const { t, locale } = useI18n();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {channels.map((c) => {
        const current = c.id === currentId;
        const name = (
          <AppText variant="cardTitle" numberOfLines={1} style={isTV && styles.name}>
            {channelTitle(c, locale)}
          </AppText>
        );
        return (
          <Focusable
            key={c.id}
            onPress={() => onSelect(c)}
            accessibilityRole="button"
            accessibilityLabel={channelTitle(c, locale)}
            accessibilityState={{ selected: current }}
            containerStyle={{ width: TILE_WIDTH + (isTV ? 24 : 0) }}
            style={[styles.tile, current && styles.tileCurrent]}
          >
            {/* TV: monogram + name on one line (Stitch TV player). Phone: name below, like the mobile design. */}
            <View style={styles.head}>
              <ChannelMonogram logo={c.logo} size={isTV ? 28 : 36} />
              {isTV ? name : <View style={styles.name} />}
              {isPlayable(c) && <View style={styles.liveDot} />}
            </View>
            {!isTV && name}
            <AppText variant="meta" color={colors.textSecondary} numberOfLines={1}>
              {c.authorizationStatus === 'TEST_STREAM' ? t.player.testStream : t.category[c.category]}
            </AppText>
            {current && <View style={styles.underline} />}
          </Focusable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: isTV ? spacing.xs : spacing.md, paddingHorizontal: isTV ? 0 : spacing.lg },
  tile: {
    backgroundColor: 'rgba(31,31,34,0.88)',
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.divider,
    padding: spacing.md,
    gap: spacing.sm,
    overflow: 'hidden',
  },
  tileCurrent: { borderColor: 'rgba(231,0,19,0.6)' },
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  name: { flex: 1 },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.accent },
  underline: { position: 'absolute', start: 0, end: 0, bottom: 0, height: 3, backgroundColor: colors.accent },
});
