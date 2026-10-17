import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { Focusable } from '@/components/tv/Focusable';
import { colors, radii, spacing } from '@/theme/tokens';
import { isTV } from '@/utils/platform';

/** Category filter chip (Stitch "Chaînes" screens): selected = red fill on phone, red dot on TV. */
export function Chip({
  label,
  selected,
  onPress,
  hasTVPreferredFocus,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  hasTVPreferredFocus?: boolean;
}) {
  return (
    <Focusable
      variant="button"
      glow={false}
      radius={radii.full}
      onPress={onPress}
      hasTVPreferredFocus={hasTVPreferredFocus}
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      style={[styles.chip, selected && styles.selected]}
    >
      <View style={styles.row}>
        {selected && <View style={styles.dot} />}
        <AppText variant="meta" color={colors.textPrimary} style={styles.label}>
          {label}
        </AppText>
      </View>
    </Focusable>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: colors.surface2,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.divider,
    paddingHorizontal: isTV ? spacing.lg : spacing.lg,
    paddingVertical: isTV ? spacing.sm : spacing.sm + 2,
  },
  selected: { backgroundColor: isTV ? colors.surface3 : colors.accent, borderColor: isTV ? colors.dividerStrong : colors.accent },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs + 2 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: isTV ? colors.accent : colors.onAccent },
  label: { fontSize: isTV ? 13 : 14 },
});
