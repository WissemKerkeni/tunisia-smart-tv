import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { ComponentProps, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { colors, radii, spacing } from '@/theme/tokens';

/** Dashed hint card (Stitch TV favorites "Ajouter des favoris"). */
export function EmptyState({
  icon,
  title,
  hint,
  action,
}: {
  icon: ComponentProps<typeof MaterialIcons>['name'];
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <MaterialIcons name={icon} size={22} color={colors.textSecondary} />
      </View>
      <View style={styles.text}>
        <AppText variant="cardTitle">{title}</AppText>
        {hint && (
          <AppText variant="meta" color={colors.textSecondary}>
            {hint}
          </AppText>
        )}
      </View>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    padding: spacing.lg,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.dividerStrong,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, gap: 2 },
});
