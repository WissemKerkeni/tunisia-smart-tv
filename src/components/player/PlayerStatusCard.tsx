import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { Button } from '@/components/common/Button';
import type { PlaybackState } from '@/features/player/usePlayback';
import { useI18n } from '@/localization/i18n';
import { MAX_AUTO_RETRIES } from '@/services/playback/retryPolicy';
import { colors, radii, spacing } from '@/theme/tokens';
import { isTV } from '@/utils/platform';

/**
 * Everything that isn't plain playback: spinner while loading/reconnecting,
 * the Stitch "Lecture impossible" card with a retry button, or the
 * "no authorized source" notice. Renders nothing while playing/paused.
 */
export function PlayerStatusCard({
  state,
  attempt,
  onRetry,
  retryHasFocus,
}: {
  state: PlaybackState;
  attempt: number;
  onRetry: () => void;
  retryHasFocus?: boolean;
}) {
  const { t } = useI18n();

  if (state === 'playing' || state === 'paused') return null;

  if (state === 'loading' || state === 'retrying') {
    return (
      <View style={styles.center} pointerEvents="none">
        <ActivityIndicator size="large" color={colors.accent} />
        <AppText variant="meta" color={colors.textSecondary}>
          {state === 'retrying' ? t.player.retrying(attempt + 1, MAX_AUTO_RETRIES) : t.player.loading}
        </AppText>
      </View>
    );
  }

  if (state === 'unavailable') {
    return (
      <View style={styles.card}>
        <MaterialIcons name="block" size={isTV ? 28 : 24} color={colors.textSecondary} />
        <View style={styles.text}>
          <AppText variant="cardTitle">{t.streamUnavailable}</AppText>
          <AppText variant="meta" color={colors.textSecondary}>
            {t.streamUnavailableHint}
          </AppText>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.card, styles.errorCard]}>
      <View style={styles.errorIcon}>
        <MaterialIcons name={state === 'offline' ? 'wifi-off' : 'error-outline'} size={22} color={colors.error} />
      </View>
      <View style={styles.text}>
        <AppText variant="cardTitle">{t.player.errorTitle}</AppText>
        <AppText variant="meta" color={colors.textSecondary}>
          {state === 'offline' ? t.player.offlineHint : t.player.errorHint}
        </AppText>
      </View>
      <Button kind="primary" label={t.player.retry} onPress={onRetry} hasTVPreferredFocus={retryHasFocus} />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', gap: spacing.md },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    padding: spacing.lg,
    borderRadius: radii.lg,
    backgroundColor: 'rgba(14,14,17,0.92)',
    borderWidth: 1,
    borderColor: colors.dividerStrong,
    maxWidth: isTV ? 560 : undefined,
    width: '100%',
  },
  errorCard: { borderColor: 'rgba(231,0,19,0.45)' },
  errorIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(147,0,10,0.35)',
  },
  text: { flex: 1, gap: 2 },
});
