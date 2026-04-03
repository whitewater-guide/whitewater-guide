import { isLicenseWithLogo } from '@whitewater-guide/clients';
import type { License } from '@whitewater-guide/schema';
import React, { memo, useCallback } from 'react';
import type { ImageStyle, StyleProp } from 'react-native';
import { Image, Linking, Pressable, StyleSheet } from 'react-native';
import Config from 'react-native-config';

const styles = StyleSheet.create({
  logo: {
    width: 134,
    height: 47,
  },
});

interface Props {
  license: License;
  style?: StyleProp<ImageStyle>;
}

function LicenseLogo({ license, style }: Props) {
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
        source={{
          uri: `${Config.STATIC_CONTENT_URL_BASE}/licenses/${license.slug}.png`,
          cache: 'default',
        }}
        style={[styles.logo, style]}
        resizeMode="contain"
      />
    </Pressable>
  );
}

export default memo(LicenseLogo);
