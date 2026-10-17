import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { useI18n } from '@/localization/i18n';
import { colors, radii, spacing } from '@/theme/tokens';

/** Stitch TV footer: OK / ▲▼◀▶ / RETOUR key hints. */
export function RemoteHintBar() {
  const { t } = useI18n();
  const hints: [string, string][] = [
    ['OK', t.hints.select],
    ['▲ ▼ ◀ ▶', t.hints.navigate],
    [t.hints.backKey, t.hints.back],
  ];
  return (
    <View style={styles.bar}>
      {hints.map(([key, label]) => (
        <View key={key} style={styles.hint}>
          <View style={styles.key}>
            <AppText variant="badge" color={colors.textPrimary} style={styles.ltr}>
              {key}
            </AppText>
          </View>
          <AppText variant="meta" color={colors.textSecondary}>
            {label}
          </AppText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    gap: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: spacing.md,
  },
  hint: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  key: {
    borderWidth: 1,
    borderColor: colors.dividerStrong,
    backgroundColor: colors.surface2,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  ltr: { writingDirection: 'ltr' },
});
