import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Constants from 'expo-constants';
import type { ComponentProps, ReactNode } from 'react';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { Chip } from '@/components/common/Chip';
import { Screen, SCREEN_GUTTER } from '@/components/common/Screen';
import { Focusable } from '@/components/tv/Focusable';
import type { LanguagePreference } from '@/data/storage/preferencesStorage';
import { useLibrary } from '@/features/library/LibraryProvider';
import { useI18n } from '@/localization/i18n';
import { colors, radii, spacing } from '@/theme/tokens';
import { isTV } from '@/utils/platform';

type IconName = ComponentProps<typeof MaterialIcons>['name'];

/**
 * Stitch "Favoris & Paramètres" (settings half). Only settings that actually
 * work are shown.
 */
export default function SettingsScreen() {
  const { t } = useI18n();
  const { history, clearHistory } = useLibrary();
  const [cleared, setCleared] = useState(false);
  const version = Constants.expoConfig?.version ?? '—';

  return (
    <Screen title={t.nav.settings}>
      <View style={[styles.panel, { marginHorizontal: SCREEN_GUTTER }]}>
        <LanguageRow />
        <Row
          icon="delete-outline"
          title={t.settings.clearHistory}
          hint={cleared ? t.settings.cleared : t.settings.clearHistoryHint}
          danger
          disabled={history.length === 0}
          onPress={() => {
            clearHistory();
            setCleared(true);
          }}
        >
          <View style={styles.dangerAction}>
            <AppText variant="meta" color={colors.error}>
              {t.settings.clearHistoryAction}
            </AppText>
          </View>
        </Row>
        <Row icon="info-outline" title={t.settings.about} hint={t.settings.contentNotice} last>
          <Value mono>{`v${version}`}</Value>
        </Row>
      </View>
    </Screen>
  );
}

/** Language names stay in their own script whatever the UI language. */
const LANGUAGE_OPTIONS: readonly { value: LanguagePreference; label?: string }[] = [
  { value: 'system' },
  { value: 'fr', label: 'Français' },
  { value: 'ar', label: 'العربية' },
];

function LanguageRow() {
  const { t, language, setLanguage } = useI18n();
  return (
    <View style={[styles.row, styles.rowDivider, styles.languageRow]}>
      <View style={styles.languageHead}>
        <MaterialIcons name="translate" size={22} color={colors.textSecondary} />
        <View style={styles.rowText}>
          <AppText variant="cardTitle">{t.settings.language}</AppText>
          <AppText variant="meta" color={colors.textSecondary}>
            {t.settings.languageHint}
          </AppText>
        </View>
      </View>
      <View style={styles.languageOptions} accessibilityRole="tablist">
        {LANGUAGE_OPTIONS.map((o) => (
          <Chip
            key={o.value}
            label={o.label ?? t.settings.languageSystem}
            selected={language === o.value}
            hasTVPreferredFocus={language === o.value}
            onPress={() => language !== o.value && setLanguage(o.value)}
          />
        ))}
      </View>
    </View>
  );
}

function Value({ children, mono }: { children: ReactNode; mono?: boolean }) {
  return (
    <View style={styles.value}>
      <AppText variant="meta" color={colors.gold} style={mono && styles.mono}>
        {children}
      </AppText>
    </View>
  );
}

function Row({
  icon,
  title,
  hint,
  children,
  onPress,
  danger,
  disabled,
  last,
  hasTVPreferredFocus,
}: {
  icon: IconName;
  title: string;
  hint?: string;
  children?: ReactNode;
  onPress?: () => void;
  danger?: boolean;
  disabled?: boolean;
  last?: boolean;
  hasTVPreferredFocus?: boolean;
}) {
  const content = (focused: boolean) => (
    <View style={[styles.row, !last && styles.rowDivider, disabled && styles.disabled, focused && styles.rowFocused]}>
      <MaterialIcons name={icon} size={22} color={danger ? colors.error : colors.textSecondary} />
      <View style={styles.rowText}>
        <AppText variant="cardTitle" color={danger ? colors.error : colors.textPrimary}>
          {title}
        </AppText>
        {hint && (
          <AppText variant="meta" color={colors.textSecondary}>
            {hint}
          </AppText>
        )}
      </View>
      {children}
    </View>
  );

  // Non-interactive rows stay focusable on TV so the D-pad can reach and read them.
  return (
    <Focusable
      variant="button"
      glow={false}
      radius={radii.md}
      disabled={disabled}
      focusable={isTV ? !disabled : !!onPress}
      onPress={onPress}
      hasTVPreferredFocus={hasTVPreferredFocus && !disabled}
      accessibilityRole={onPress ? 'button' : 'text'}
      containerStyle={styles.noOverflow}
    >
      {({ focused }) => content(focused)}
    </Focusable>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.surface1,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.divider,
    maxWidth: isTV ? 640 : undefined,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 64,
  },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  // TV: options beside the label. Phone: below it, the row is too narrow.
  languageRow: isTV ? {} : { flexDirection: 'column', alignItems: 'stretch' },
  languageHead: { flex: isTV ? 1 : undefined, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  languageOptions: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  rowFocused: { backgroundColor: colors.surface3 },
  noOverflow: { margin: 0, padding: 0 },
  rowText: { flex: 1, gap: 2 },
  disabled: { opacity: 0.4 },
  value: {
    borderWidth: 1,
    borderColor: 'rgba(228,194,133,0.35)',
    backgroundColor: 'rgba(93,69,20,0.3)',
    borderRadius: radii.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  mono: { fontFamily: 'monospace' },
  dangerAction: {
    borderWidth: 1,
    borderColor: 'rgba(255,180,171,0.35)',
    backgroundColor: 'rgba(147,0,10,0.25)',
    borderRadius: radii.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
});
