import type { License } from '@whitewater-guide/schema';
import { Image } from 'expo-image';
import { memo, useCallback } from 'react';
import type { ImageStyle, StyleProp } from 'react-native';
import { Linking, Pressable, StyleSheet } from 'react-native';

import { STATIC_CONTENT_URL_BASE } from '@/constants/urls';
import { isLicenseWithLogo } from '@/features/licenses';

export interface LicenseLogoProps {
  license: License;
  style?: StyleProp<ImageStyle>;
}

function LicenseLogo({ license, style }: LicenseLogoProps) {
  const handleLink = useCallback(() => {
    if (license.url) {
      Linking.openURL(license.url).catch(() => {
        /* Ignore */
      });
    }
  }, [license.url]);

  if (!isLicenseWithLogo(license)) {
    return null;
  }

  return (
    <Pressable onPress={handleLink}>
      <Image
        source={`${STATIC_CONTENT_URL_BASE}/licenses/${license.slug}.png`}
        style={[styles.logo, style]}
        contentFit="contain"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 134,
    height: 47,
  },
});

export default memo(LicenseLogo);
