import { License } from '@whitewater-guide/commons';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import theme from '~/theme';

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

const LicenseBadge = memo<Props>((props) => {
  const { t } = useTranslation();
  const { license, copyright, placement, divider, light, style } = props;
  const { name, url } = license;
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
      <View>
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
      <LicenseLogo license={license} style={styles.logo} />
    </View>
  );
});

export default LicenseBadge;
