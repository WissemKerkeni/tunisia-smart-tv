import { LinearGradient } from 'expo-linear-gradient';
import { type DimensionValue, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { LiveBadge } from '@/components/common/LiveBadge';
import { FOCUS_OVERFLOW_PAD, Focusable } from '@/components/tv/Focusable';
import { type Channel, isPlayable } from '@/domain/models/Channel';
import { useI18n } from '@/localization/i18n';
import { colors, radii, spacing } from '@/theme/tokens';
import { isTV } from '@/utils/platform';

import { ChannelMonogram } from './ChannelMonogram';

export const CHANNEL_CARD_WIDTH = isTV ? 172 : 160;
const ART_HEIGHT = isTV ? 92 : 90;

export function channelTitle(channel: Channel, locale: string) {
  return locale === 'ar' && channel.nameAr ? channel.nameAr : channel.name;
}

/**
 * Stitch channel tile: gradient art + CH chip + DIRECT pill (only when the
 * channel is actually playable) + centered monogram, then title/subtitle.
 * On TV the focused tile also shows the "OK Regarder" pill.
 */
export function ChannelCard({
  channel,
  subtitle,
  onPress,
  onFocus,
  width = CHANNEL_CARD_WIDTH,
  hasTVPreferredFocus,
}: {
  channel: Channel;
  subtitle?: string;
  onPress: () => void;
  onFocus?: () => void;
  width?: DimensionValue;
  hasTVPreferredFocus?: boolean;
}) {
  const { t, locale } = useI18n();
  const title = channelTitle(channel, locale);
  const tint = channel.logo.kind === 'monogram' ? channel.logo.colors[0] : colors.surface3;
  const live = isPlayable(channel);

  return (
    <Focusable
      onPress={onPress}
      onFocus={onFocus}
      hasTVPreferredFocus={hasTVPreferredFocus}
      accessibilityRole="button"
      accessibilityLabel={title}
      containerStyle={{ width: isTV && typeof width === 'number' ? width + 2 * FOCUS_OVERFLOW_PAD : width }}
      style={styles.card}
    >
      {({ focused }) => (
        <>
          <LinearGradient colors={[tint, colors.surface2]} style={styles.art}>
            <View style={styles.artTop}>
              <View style={styles.numberChip}>
                <AppText variant="badge" color={colors.textPrimary} style={styles.ltr}>
                  {`CH ${String(channel.number).padStart(2, '0')}`}
                </AppText>
              </View>
              {live && <LiveBadge label={t.liveShort} size="sm" />}
            </View>
            <ChannelMonogram logo={channel.logo} size={isTV ? 46 : 46} />
          </LinearGradient>
          <View style={styles.body}>
            {isTV && focused ? (
              <View style={styles.okPill}>
                <AppText variant="badge" color={colors.onAccent}>
                  {`▶ ${t.okWatch}`}
                </AppText>
              </View>
            ) : null}
            <AppText variant="cardTitle" numberOfLines={1}>
              {title}
            </AppText>
            <AppText variant="meta" color={focused ? colors.gold : colors.textSecondary} numberOfLines={1}>
              {subtitle ?? t.category[channel.category]}
            </AppText>
          </View>
        </>
      )}
    </Focusable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface2,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.divider,
    overflow: 'hidden',
  },
  art: { height: ART_HEIGHT, alignItems: 'center', justifyContent: 'center' },
  artTop: {
    position: 'absolute',
    top: spacing.sm,
    start: spacing.sm,
    end: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  numberChip: {
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: radii.sm,
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 1,
  },
  ltr: { writingDirection: 'ltr' },
  body: { padding: spacing.md, gap: 2 },
  okPill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accent,
    borderRadius: radii.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    marginBottom: spacing.xs,
  },
});
