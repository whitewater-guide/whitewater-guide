import type { License } from '@whitewater-guide/schema';
import React, { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { StyleProp, ViewStyle } from 'react-native';
import { Linking, StyleSheet, View } from 'react-native';

import theme from '../theme';
import Divider from './Divider';
import LicenseLogo from './LicenseLogo';
import Markdown from './Markdown';
import TextWithLinks from './TextWithLinks';

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.margin.single,
  },
  logo: {
    marginTop: theme.margin.double,
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

function LicenseBadge({ license, copyright, placement, divider, light, style }: Props) {
  const { t } = useTranslation();
  const { name, url } = license;

  const handleLink = useCallback(() => {
    if (url) {
      Linking.openURL(url).catch(() => {
        /* Ignore */
      });
    }
  }, [url]);

  return (
    <View style={[styles.container, style]}>
      {divider && <Divider />}
      <View>
        <TextWithLinks
          onLink={handleLink}
          textStyle={light ? styles.textLight : undefined}
        >
          {t(`components:license.${placement}`, {
            name: url ? `[${name}](1)` : name,
          })}
        </TextWithLinks>
        {!!copyright && <Markdown>{`© ${copyright}`}</Markdown>}
      </View>
      <LicenseLogo license={license} style={styles.logo} />
    </View>
  );
}

export default memo(LicenseBadge);
