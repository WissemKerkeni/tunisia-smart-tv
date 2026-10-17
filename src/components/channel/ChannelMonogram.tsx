import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import type { ChannelLogo } from '@/domain/models/Channel';
import { colors, fonts, radii } from '@/theme/tokens';

/** Original monogram tile (no broadcaster logos), or an authorized image logo when one exists. */
export function ChannelMonogram({ logo, size }: { logo: ChannelLogo; size: number }) {
  if (logo.kind === 'image') {
    return (
      <Image
        source={{ uri: logo.uri }}
        style={{ width: size, height: size, borderRadius: radii.md }}
        contentFit="contain"
      />
    );
  }
  return (
    <View
      style={[
        styles.tile,
        {
          width: size,
          height: size,
          backgroundColor: logo.colors[0],
          borderColor: colors.dividerStrong,
        },
      ]}
    >
      <AppText
        variant="cardTitle"
        style={{ fontFamily: fonts.headlineHeavy, fontSize: size * 0.34, lineHeight: size * 0.42, writingDirection: 'ltr' }}
      >
        {logo.text}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.md,
    borderWidth: 1,
  },
});
