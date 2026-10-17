import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { Button } from '@/components/common/Button';
import { LiveBadge } from '@/components/common/LiveBadge';
import { useTVScrollTo } from '@/components/tv/TVScroll';
import { type Channel, isPlayable } from '@/domain/models/Channel';
import { useI18n } from '@/localization/i18n';
import { colors, fonts, radii, spacing } from '@/theme/tokens';
import { isTV } from '@/utils/platform';

import { channelTitle } from './ChannelCard';
import { ChannelMonogram } from './ChannelMonogram';

/**
 * Stitch "Accueil" hero. No EPG source exists, so the hero features the
 * channel itself (name, category, languages, description) instead of a fake
 * programme title/time/progress.
 */
export function FeaturedHero({
  channel,
  favorite,
  onWatch,
  onToggleFavorite,
}: {
  channel: Channel;
  favorite: boolean;
  onWatch: () => void;
  onToggleFavorite: () => void;
}) {
  const { t, locale } = useI18n();
  const scrollTo = useTVScrollTo();
  const tint = channel.logo.kind === 'monogram' ? channel.logo.colors[0] : colors.surface3;
  const monogram = channel.logo.kind === 'monogram' ? channel.logo.text : '';
  const meta = [t.category[channel.category], ...(channel.languages ?? []).map((l) => t.languageName[l])].join(' · ');

  return (
    <View style={[styles.hero, isTV ? styles.heroTV : styles.heroPhone]}>
      <LinearGradient
        colors={[tint, colors.bg]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {/* Oversized faded monogram as artwork (no third-party imagery). */}
      <AppText style={styles.watermark} numberOfLines={1}>
        {monogram}
      </AppText>
      <View style={styles.content}>
        <View style={styles.tags}>
          {isPlayable(channel) && <LiveBadge label={t.live} />}
          <View style={styles.channelChip}>
            <ChannelMonogram logo={channel.logo} size={20} />
            <AppText variant="badge">{channel.name}</AppText>
          </View>
        </View>
        <AppText variant="display" numberOfLines={2}>
          {channelTitle(channel, locale)}
        </AppText>
        <AppText variant="body" color={colors.textSecondary}>
          {meta}
        </AppText>
        {channel.description && (
          <AppText variant="body" style={styles.description} numberOfLines={2}>
            {channel.description}
          </AppText>
        )}
        <View style={styles.actions}>
          <Button kind="primary" icon="play-arrow" label={t.watch} onPress={onWatch} onFocus={() => scrollTo(0)} hasTVPreferredFocus />
          <Button
            icon={favorite ? 'favorite' : 'favorite-border'}
            iconColor={favorite ? colors.accent : undefined}
            label={isTV ? (favorite ? t.removeFavorite : t.addFavorite) : undefined}
            round={!isTV}
            accessibilityLabel={favorite ? t.removeFavorite : t.addFavorite}
            onFocus={() => scrollTo(0)}
            onPress={onToggleFavorite}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    minHeight: isTV ? 270 : 360,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  heroPhone: {
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  heroTV: { borderRadius: radii.lg },
  watermark: {
    position: 'absolute',
    end: isTV ? 24 : -8,
    top: isTV ? 0 : 8,
    fontFamily: fonts.headlineHeavy,
    fontSize: isTV ? 220 : 150,
    lineHeight: isTV ? 240 : 170,
    color: 'rgba(255,255,255,0.06)',
    writingDirection: 'ltr',
  },
  content: { padding: isTV ? spacing.xxl : spacing.xl, gap: spacing.sm, maxWidth: isTV ? 560 : undefined },
  tags: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' },
  channelChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.dividerStrong,
    paddingStart: 3,
    paddingEnd: spacing.md,
    paddingVertical: 3,
  },
  description: { color: colors.textPrimary, opacity: 0.85 },
  actions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
});
