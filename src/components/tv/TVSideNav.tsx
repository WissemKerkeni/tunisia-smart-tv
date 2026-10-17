import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, usePathname } from 'expo-router';
import { StyleSheet, TVFocusGuideView, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { Focusable } from '@/components/tv/Focusable';
import { useClock } from '@/hooks/useClock';
import { useI18n } from '@/localization/i18n';
import { isActive, MAIN_NAV } from '@/navigation/mainNav';
import { colors, radii, spacing } from '@/theme/tokens';

export const TV_RAIL_WIDTH = 88;

/** Stitch TV left rail: logo, 5 destinations (active = red tile), clock. */
export function TVSideNav() {
  const pathname = usePathname();
  const { t } = useI18n();
  const clock = useClock();

  return (
    <View style={styles.rail}>
      <View style={styles.logo}>
        <View style={styles.logoTile}>
          <AppText variant="badge" color={colors.onAccent} style={styles.logoText}>
            TV
          </AppText>
        </View>
        <AppText variant="badge" style={styles.wordmark}>
          Tunisie<AppText variant="badge" color={colors.accent} style={styles.wordmark}>TV</AppText>
        </AppText>
      </View>

      {/* autoFocus: entering the rail lands on the last-focused item (first time: the first),
          not the geometrically nearest one. trapFocusUp/Down keeps UP/DOWN inside the rail. */}
      <TVFocusGuideView style={styles.items} autoFocus trapFocusUp trapFocusDown>
        {MAIN_NAV.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Focusable
              key={item.key}
              variant="button"
              glow={false}
              radius={radii.lg}
              onPress={() => {
                if (!active) router.replace(item.href);
              }}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              accessibilityLabel={t.nav[item.key]}
              style={[styles.item, active && styles.itemActive]}
            >
              <MaterialIcons
                name={active ? item.iconActive : item.icon}
                size={22}
                color={active ? colors.onAccent : colors.textSecondary}
              />
              <AppText variant="badge" color={active ? colors.onAccent : colors.textSecondary} style={styles.itemLabel}>
                {t.nav[item.key]}
              </AppText>
            </Focusable>
          );
        })}
      </TVFocusGuideView>

      <View style={styles.footer}>
        <AppText variant="cardTitle" style={styles.ltr}>
          {clock}
        </AppText>
        <AppText variant="badge" color={colors.textMuted}>
          TUNIS
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rail: {
    width: TV_RAIL_WIDTH,
    backgroundColor: colors.bgDeep,
    borderEndWidth: 1,
    borderEndColor: colors.divider,
    alignItems: 'center',
    paddingVertical: 27,
    justifyContent: 'space-between',
  },
  logo: { alignItems: 'center', gap: spacing.xs },
  logoTile: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { fontSize: 13, letterSpacing: 0 },
  wordmark: { fontSize: 9, textTransform: 'none', letterSpacing: 0 },
  items: { gap: spacing.sm, alignItems: 'center' },
  item: {
    width: 68,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    gap: 2,
    borderRadius: radii.lg,
  },
  itemActive: { backgroundColor: colors.accent, boxShadow: '0 0 16px rgba(231,0,19,0.45)' },
  itemLabel: { fontSize: 9, textTransform: 'none', letterSpacing: 0 },
  footer: { alignItems: 'center' },
  ltr: { writingDirection: 'ltr' },
});
