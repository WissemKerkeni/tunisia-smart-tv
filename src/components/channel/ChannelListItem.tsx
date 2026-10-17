import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { type Channel, isPlayable } from '@/domain/models/Channel';
import { useI18n } from '@/localization/i18n';
import { colors, minTouchTarget, radii, spacing } from '@/theme/tokens';

import { channelTitle } from './ChannelCard';
import { ChannelMonogram } from './ChannelMonogram';

/** Phone list row (Stitch "Chaînes Mobile"): monogram, number + name, meta, heart. */
export function ChannelListItem({
  channel,
  favorite,
  onPress,
  onToggleFavorite,
}: {
  channel: Channel;
  favorite: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
}) {
  const { t, locale } = useI18n();
  const title = channelTitle(channel, locale);
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <ChannelMonogram logo={channel.logo} size={56} />
      <View style={styles.text}>
        <View style={styles.titleLine}>
          <AppText variant="meta" color={colors.textMuted} style={styles.ltr}>
            {String(channel.number).padStart(2, '0')}
          </AppText>
          <AppText variant="cardTitle" numberOfLines={1} style={styles.flex}>
            {title}
          </AppText>
          {isPlayable(channel) && (
            <AppText variant="badge" color={colors.accent}>
              {`● ${t.liveShort}`}
            </AppText>
          )}
        </View>
        <AppText variant="meta" color={colors.textSecondary} numberOfLines={1}>
          {channel.description ?? t.category[channel.category]}
        </AppText>
      </View>
      <Pressable
        onPress={onToggleFavorite}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={favorite ? t.removeFavorite : t.addFavorite}
        accessibilityState={{ selected: favorite }}
        style={styles.heart}
      >
        <MaterialIcons
          name={favorite ? 'favorite' : 'favorite-border'}
          size={24}
          color={favorite ? colors.accent : colors.textSecondary}
        />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface2,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.divider,
    minHeight: 80,
  },
  pressed: { opacity: 0.85 },
  text: { flex: 1, gap: spacing.xs },
  titleLine: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  flex: { flexShrink: 1 },
  ltr: { writingDirection: 'ltr' },
  heart: { width: minTouchTarget, height: minTouchTarget, alignItems: 'center', justifyContent: 'center' },
});
