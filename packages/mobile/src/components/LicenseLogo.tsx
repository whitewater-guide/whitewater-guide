import { isCommonLicense, License } from '@whitewater-guide/commons';
import React, { memo } from 'react';
import { Linking, Pressable, StyleProp, StyleSheet } from 'react-native';
import FastImage, { ImageStyle } from 'react-native-fast-image';
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
  if (!isCommonLicense(license)) {
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
