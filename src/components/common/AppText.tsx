import { StyleSheet, Text, type TextProps } from 'react-native';

import { colors, fonts, type TypeVariant, typeScale } from '@/theme/tokens';
import { isTV } from '@/utils/platform';

const scale = typeScale[isTV ? 'tv' : 'phone'];

const variantFont: Record<TypeVariant, string> = {
  display: fonts.headlineHeavy,
  section: fonts.headline,
  cardTitle: fonts.headline,
  body: fonts.body,
  meta: fonts.bodyMedium,
  badge: fonts.bodyBold,
};

export interface AppTextProps extends TextProps {
  variant?: TypeVariant;
  color?: string;
}

export function AppText({ variant = 'body', color = colors.textPrimary, style, ...rest }: AppTextProps) {
  const size = scale[variant];
  return (
    <Text
      {...rest}
      style={[
        styles.base,
        { fontFamily: variantFont[variant], fontSize: size, lineHeight: Math.round(size * 1.3), color },
        variant === 'badge' && styles.badge,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: { textAlign: 'auto', writingDirection: 'auto' },
  badge: { textTransform: 'uppercase', letterSpacing: 0.5 },
});
