import { type ReactNode, useState } from 'react';
import {
  Animated,
  Pressable,
  type PressableProps,
  type StyleProp,
  StyleSheet,
  type ViewStyle,
} from 'react-native';

import { colors, focus, radii } from '@/theme/tokens';
import { isTV } from '@/utils/platform';

export interface FocusableProps extends Omit<PressableProps, 'children' | 'style'> {
  children: ReactNode | ((state: { focused: boolean }) => ReactNode);
  style?: StyleProp<ViewStyle>;
  /** Outer layout (width, flex, margins) of the focusable box. */
  containerStyle?: StyleProp<ViewStyle>;
  /** `card` → scale 1.08, `button` → 1.05 (Stitch TV focus spec). */
  variant?: 'card' | 'button';
  radius?: number;
  /** Red glow around the focus ring (cards, primary CTA). */
  glow?: boolean;
}

/**
 * D-pad focusable surface. On TV: animated scale, 4dp white ring drawn as an
 * overlay (so focus never shifts layout), optional red glow. On phones it is a
 * plain Pressable with pressed feedback.
 */
export function Focusable({
  children,
  style,
  containerStyle,
  variant = 'card',
  radius = radii.lg,
  glow = true,
  onFocus,
  onBlur,
  ...rest
}: FocusableProps) {
  const [focused, setFocused] = useState(false);
  const [scale] = useState(() => new Animated.Value(1));

  const animateTo = (to: number) =>
    Animated.timing(scale, { toValue: to, duration: focus.durationMs, useNativeDriver: true }).start();

  const target = variant === 'card' ? focus.cardScale : focus.buttonScale;

  return (
    <Pressable
      {...rest}
      // Phones also move focus (e.g. initial focus), but focus visuals are TV-only.
      onFocus={(e) => {
        if (isTV) {
          setFocused(true);
          animateTo(target);
        }
        onFocus?.(e);
      }}
      onBlur={(e) => {
        if (isTV) {
          setFocused(false);
          animateTo(1);
        }
        onBlur?.(e);
      }}
      style={({ pressed }) => [isTV && styles.tvOverflow, containerStyle, !isTV && pressed && styles.pressed]}
    >
      <Animated.View
        style={[
          { borderRadius: radius, transform: [{ scale }] },
          focused && glow && { boxShadow: `0 0 24px ${focus.glow}` },
          style,
        ]}
      >
        {typeof children === 'function' ? children({ focused }) : children}
        {focused && (
          <Animated.View
            pointerEvents="none"
            style={[StyleSheet.absoluteFill, styles.ring, { borderRadius: radius }]}
          />
        )}
      </Animated.View>
    </Pressable>
  );
}

/**
 * Invisible margin around the focusable box on TV, cancelled by an equal negative
 * margin. Android scrolls the focused view's *layout* rect into view; without this
 * the 1.08 scale + ring would be cut off at screen edges.
 */
export const FOCUS_OVERFLOW_PAD = 12;

const styles = StyleSheet.create({
  tvOverflow: { padding: FOCUS_OVERFLOW_PAD, margin: -FOCUS_OVERFLOW_PAD },
  ring: { borderWidth: focus.ringWidth, borderColor: colors.focusRing },
  pressed: { opacity: 0.85, transform: [{ scale: 0.97 }] },
});
