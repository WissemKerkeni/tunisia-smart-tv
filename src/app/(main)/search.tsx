import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { ChannelCard } from '@/components/channel/ChannelCard';
import { ChannelListItem } from '@/components/channel/ChannelListItem';
import { AppText } from '@/components/common/AppText';
import { Screen, SCREEN_GUTTER } from '@/components/common/Screen';
import type { Channel } from '@/domain/models/Channel';
import { filterChannels } from '@/domain/usecases/searchChannels';
import { useLibrary } from '@/features/library/LibraryProvider';
import { useChannels } from '@/hooks/useChannels';
import { useI18n } from '@/localization/i18n';
import { colors, focus, fonts, radii, spacing, typeScale } from '@/theme/tokens';
import { isTV } from '@/utils/platform';

const openPlayer = (c: Channel) => router.push({ pathname: '/player/[id]', params: { id: c.id } });

/** Search by name (FR/AR). No dedicated Stitch screen: built from the design-system components. */
export default function SearchScreen() {
  const channels = useChannels();
  const { t } = useI18n();
  const { isFavorite, toggleFavorite } = useLibrary();
  const [query, setQuery] = useState('');
  const [inputFocused, setInputFocused] = useState(false);

  const results = query.trim() ? filterChannels(channels ?? [], { query }) : [];

  return (
    <Screen title={t.nav.search}>
      <View style={{ paddingHorizontal: SCREEN_GUTTER, gap: spacing.sm }}>
        <View style={[styles.field, inputFocused && styles.fieldFocused]}>
          <MaterialIcons name="search" size={22} color={colors.textSecondary} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t.searchPlaceholder}
            placeholderTextColor={colors.textMuted}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
            hasTVPreferredFocus
            // No explicit textAlign: Android swaps left/right under RTL, so the natural start edge is right.
            style={styles.input}
          />
        </View>
        <AppText variant="meta" color={colors.textMuted}>
          {t.searchHint}
        </AppText>
      </View>

      {query.trim() !== '' && results.length === 0 && (
        <AppText variant="body" color={colors.textSecondary} style={{ paddingHorizontal: SCREEN_GUTTER }}>
          {t.noResults(query.trim())}
        </AppText>
      )}

      {isTV ? (
        <View style={[styles.grid, { paddingHorizontal: SCREEN_GUTTER }]}>
          {results.map((c) => (
            <ChannelCard key={c.id} channel={c} onPress={() => openPlayer(c)} />
          ))}
        </View>
      ) : (
        <View style={{ paddingHorizontal: SCREEN_GUTTER, gap: spacing.md }}>
          {results.map((c) => (
            <ChannelListItem
              key={c.id}
              channel={c}
              favorite={isFavorite(c.id)}
              onPress={() => openPlayer(c)}
              onToggleFavorite={() => toggleFavorite(c.id)}
            />
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface2,
    borderRadius: radii.lg,
    borderWidth: focus.ringWidth,
    borderColor: 'transparent',
    paddingHorizontal: spacing.md,
    maxWidth: isTV ? 560 : undefined,
  },
  fieldFocused: { borderColor: isTV ? colors.focusRing : colors.accent },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontFamily: fonts.bodyMedium,
    fontSize: typeScale[isTV ? 'tv' : 'phone'].cardTitle,
    paddingVertical: isTV ? spacing.sm : spacing.md,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg, paddingVertical: spacing.sm },
});
