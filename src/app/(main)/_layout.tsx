import { router, Slot, usePathname } from 'expo-router';
import { useEffect } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';

import { BottomTabs } from '@/components/mobile/BottomTabs';
import { TVSideNav } from '@/components/tv/TVSideNav';
import { colors } from '@/theme/tokens';
import { isTV } from '@/utils/platform';

/**
 * Main shell. Tabs switch with `router.replace`, so the history stays flat:
 * BACK on any tab returns to Home, and BACK on Home exits the app.
 */
export default function MainLayout() {
  const pathname = usePathname();

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (pathname !== '/') {
        router.replace('/');
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [pathname]);

  if (isTV) {
    return (
      <View style={styles.tv}>
        <TVSideNav />
        <View style={styles.content}>
          <Slot />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.phone}>
      <View style={styles.content}>
        <Slot />
      </View>
      <BottomTabs />
    </View>
  );
}

const styles = StyleSheet.create({
  tv: { flex: 1, flexDirection: 'row', backgroundColor: colors.bg },
  phone: { flex: 1, backgroundColor: colors.bg },
  content: { flex: 1 },
});
