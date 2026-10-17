import { type ReactNode, useCallback, useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/common/AppText';
import { OfflineBanner } from '@/components/common/OfflineBanner';
import { RemoteHintBar } from '@/components/tv/RemoteHintBar';
import { TVScrollContext } from '@/components/tv/TVScroll';
import { colors, spacing, tvSafeArea } from '@/theme/tokens';
import { isTV } from '@/utils/platform';

/** Horizontal content gutter: TV overscan margin (after the rail) or phone edge. */
export const SCREEN_GUTTER = isTV ? tvSafeArea.horizontal - 8 : spacing.lg;

/** Scrollable screen with title, offline banner and (TV) remote hint bar. */
export function Screen({
  title,
  trailing,
  children,
  scroll = true,
  hideHeader,
}: {
  title?: string;
  trailing?: ReactNode;
  children: ReactNode;
  scroll?: boolean;
  hideHeader?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const scrollTo = useCallback((y: number) => {
    scrollRef.current?.scrollTo({ y: Math.max(0, y), animated: true });
  }, []);
  const padTop = isTV ? tvSafeArea.vertical : insets.top + spacing.md;

  const header =
    !hideHeader && title ? (
      <View style={[styles.header, { paddingHorizontal: SCREEN_GUTTER }]}>
        <AppText variant="section" style={styles.title}>
          {title}
        </AppText>
        {trailing}
      </View>
    ) : null;

  const banner = <OfflineBanner style={{ marginHorizontal: SCREEN_GUTTER }} />;

  const footer = isTV ? (
    <View style={{ paddingHorizontal: SCREEN_GUTTER }}>
      <RemoteHintBar />
    </View>
  ) : null;

  if (!scroll) {
    return (
      <View style={[styles.screen, { paddingTop: padTop, paddingBottom: isTV ? tvSafeArea.vertical : 0 }]}>
        {header}
        {banner}
        <View style={styles.flex}>{children}</View>
        {footer}
      </View>
    );
  }

  return (
    <TVScrollContext.Provider value={scrollTo}>
      <ScrollView
        ref={scrollRef}
        style={styles.screen}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: padTop, paddingBottom: isTV ? tvSafeArea.vertical : spacing.xl },
        ]}
      >
        {header}
        {banner}
        {children}
        {footer}
      </ScrollView>
    </TVScrollContext.Provider>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  scrollContent: { gap: isTV ? spacing.lg : spacing.xl },
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  title: { fontSize: 26, lineHeight: 34 },
});
