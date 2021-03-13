import { COMMON_LICENSES, License } from '@whitewater-guide/commons';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import FastImage from 'react-native-fast-image';
import Config from 'react-native-ultimate-config';

import theme from '~/theme';

import Divider from './Divider';
import Markdown from './Markdown';
import TextWithLinks from './TextWithLinks';

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.margin.single,
  },
  badge: {
    marginTop: theme.margin.double,
    width: 134,
    height: 47,
  },
  texts: {
    flex: 1,
  },
  textLight: {
    color: theme.colors.textLight,
  },
});

interface Props {
  placement: 'region' | 'section' | 'media';
  divider?: boolean;
  license: License;
  copyright?: string | null;
  light?: boolean;
  style?: StyleProp<ViewStyle>;
}

const LicenseBadge = memo<Props>((props) => {
  const { t } = useTranslation();
  const { license, copyright, placement, divider, light, style } = props;
  const { name, slug, url } = license;
  const common = COMMON_LICENSES.some((l) => l.slug === slug);
  const handleLink = () => {
    if (url) {
      Linking.openURL(url).catch(() => {
        /* Ignore */
      });
    }
  };
  return (
    <View style={[styles.container, style]}>
      {divider && <Divider />}
      <View style={styles.texts}>
        <TextWithLinks
          onLink={handleLink}
          textStyle={light && styles.textLight}
        >
          {t(`components:license.${placement}`, {
            name: url ? `[${name}](1)` : name,
          })}
        </TextWithLinks>
        {!!copyright && <Markdown>{`© ${copyright}`}</Markdown>}
      </View>
      {common && (
        <FastImage
          source={{
            cache: 'web',
            uri: `${Config.STATIC_CONTENT_URL_BASE}/licenses/${slug}.png`,
          }}
          style={styles.badge}
        />
      )}
    </View>
  );
});

export default LicenseBadge;
