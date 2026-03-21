import { isLicenseWithLogo } from '@whitewater-guide/clients';
import type { ImageStyle } from '@whitewater-guide/react-native-fast-image';
import FastImage from '@whitewater-guide/react-native-fast-image';
import type { License } from '@whitewater-guide/schema';
import React, { memo } from 'react';
import type { StyleProp } from 'react-native';
import { Linking, Pressable, StyleSheet } from 'react-native';
import Config from 'react-native-ultimate-config';

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

const LicenseLogo = memo<Props>(({ license, style }) => {
  const handleLink = () => {
    if (license.url) {
      Linking.openURL(license.url).catch(() => {
        /* Ignore */
      });
    }
  };
  if (!isLicenseWithLogo(license)) {
    return null;
  }
  return (
    <Pressable onPress={handleLink}>
      <FastImage
        source={{
          cache: 'web',
          uri: `${Config.STATIC_CONTENT_URL_BASE}/licenses/${license.slug}.png`,
        }}
        style={[styles.logo, style]}
      />
    </Pressable>
  );
});

export default LicenseLogo;
