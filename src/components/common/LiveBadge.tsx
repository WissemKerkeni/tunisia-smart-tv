import { useEffect, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { colors, radii, spacing } from '@/theme/tokens';

/** Red "● EN DIRECT" pill with the Stitch `pulseLive` dot (1.8 s, opacity 1→0.4). */
export function LiveBadge({ label, size = 'md' }: { label: string; size?: 'sm' | 'md' }) {
  const [pulse] = useState(() => new Animated.Value(1));
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.4, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <View style={[styles.pill, size === 'sm' && styles.pillSm]}>
      <Animated.View style={[styles.dot, { opacity: pulse }]} />
      <AppText variant="badge" color={colors.onAccent}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    backgroundColor: colors.accent,
    borderRadius: radii.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    alignSelf: 'flex-start',
  },
  pillSm: { paddingHorizontal: spacing.sm, paddingVertical: 2 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.onAccent },
});
