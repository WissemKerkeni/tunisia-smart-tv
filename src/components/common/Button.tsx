import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { Focusable, type FocusableProps } from '@/components/tv/Focusable';
import { colors, minTouchTarget, radii, spacing } from '@/theme/tokens';
import { isTV } from '@/utils/platform';

type IconName = ComponentProps<typeof MaterialIcons>['name'];

export interface ButtonProps extends Omit<FocusableProps, 'children' | 'variant'> {
  label?: string;
  icon?: IconName;
  kind?: 'primary' | 'secondary' | 'danger';
  /** Icon-only round button (player controls, heart). */
  round?: boolean;
  iconColor?: string;
}

/** Stitch CTA buttons: red primary with glow on focus, translucent secondary. */
export function Button({ label, icon, kind = 'secondary', round, iconColor, style, ...rest }: ButtonProps) {
  const bg = kind === 'primary' ? colors.accent : kind === 'danger' ? 'rgba(147,0,10,0.35)' : colors.surface3;
  const fg = kind === 'danger' ? colors.error : colors.textPrimary;
  const iconSize = isTV ? 20 : 22;
  return (
    <Focusable
      variant="button"
      glow={kind === 'primary'}
      radius={round ? radii.full : radii.lg}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[
        styles.base,
        round ? styles.round : styles.padded,
        { backgroundColor: bg },
        kind === 'secondary' && styles.secondaryBorder,
        style,
      ]}
      {...rest}
    >
      <View style={styles.row}>
        {icon && <MaterialIcons name={icon} size={iconSize} color={iconColor ?? (kind === 'primary' ? colors.onAccent : fg)} />}
        {label && !round && (
          <AppText variant="cardTitle" color={kind === 'primary' ? colors.onAccent : fg}>
            {label}
          </AppText>
        )}
      </View>
    </Focusable>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center', minHeight: isTV ? 40 : minTouchTarget },
  padded: { paddingHorizontal: isTV ? spacing.xl : spacing.xl, paddingVertical: isTV ? spacing.sm + 2 : spacing.md },
  round: { width: isTV ? 44 : minTouchTarget, height: isTV ? 44 : minTouchTarget },
  secondaryBorder: { borderWidth: 1, borderColor: colors.dividerStrong },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
