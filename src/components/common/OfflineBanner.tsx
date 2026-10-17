import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { useIsOnline } from '@/hooks/useNetworkStatus';
import { useI18n } from '@/localization/i18n';
import { colors, radii, spacing } from '@/theme/tokens';

/** Amber banner from the Stitch phone favorites screen. Renders nothing while online. */
export function OfflineBanner({ style }: { style?: StyleProp<ViewStyle> }) {
  const online = useIsOnline();
  const { t } = useI18n();
  if (online !== false) return null;
  return (
    <View style={[styles.banner, style]} accessibilityRole="alert">
      <MaterialIcons name="wifi-off" size={18} color={colors.warning} />
      <AppText variant="meta" color={colors.gold} style={styles.text}>
        <AppText variant="meta" color={colors.warning} style={styles.bold}>
          {t.offline}
        </AppText>
        {` — ${t.offlineHint}`}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: 'rgba(245,181,68,0.45)',
    backgroundColor: 'rgba(245,181,68,0.08)',
  },
  text: { flex: 1 },
  bold: { fontWeight: '700' },
});
