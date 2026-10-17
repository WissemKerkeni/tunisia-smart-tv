import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, usePathname } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/common/AppText';
import { useI18n } from '@/localization/i18n';
import { isActive, MAIN_NAV } from '@/navigation/mainNav';
import { colors, minTouchTarget, spacing } from '@/theme/tokens';

/** Stitch phone bottom bar: 5 tabs, active = red pill (home) / red icon + dot. */
export function BottomTabs() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { t } = useI18n();

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
      {MAIN_NAV.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Pressable
            key={item.key}
            onPress={() => {
              if (!active) router.replace(item.href);
            }}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={t.nav[item.key]}
            style={styles.tab}
          >
            {/* Remount on change: on the realme 11 (Android 15, Fabric) an updated style lost its
                corner radius; a freshly mounted view always draws it correctly. */}
            <View key={active ? 'on' : 'off'} style={[styles.iconPill, active && styles.iconPillActive]}>
              <MaterialIcons
                name={active ? item.iconActive : item.icon}
                size={24}
                color={active ? colors.onAccent : colors.textSecondary}
              />
            </View>
            <AppText variant="meta" color={active ? colors.textPrimary : colors.textSecondary} numberOfLines={1}>
              {t.nav[item.key]}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.bgDeep,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: spacing.sm,
    boxShadow: '0 -4px 20px rgba(0,0,0,0.5)',
  },
  tab: { flex: 1, alignItems: 'center', gap: 2, minHeight: minTouchTarget },
  iconPill: { paddingHorizontal: spacing.lg, paddingVertical: 4, borderRadius: 16 },
  iconPillActive: { backgroundColor: colors.accent },
});
