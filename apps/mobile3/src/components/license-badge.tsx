import type { License } from '@whitewater-guide/schema';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { StyleProp, ViewStyle } from 'react-native';
import { Linking, StyleSheet, View } from 'react-native';

import Divider from '@/components/divider';
import LicenseLogo from '@/components/license-logo';
import Markdown from '@/components/markdown';
import TextWithLinks from '@/components/text-with-links';
import { Spacing } from '@/constants/theme';

export type LicensePlacement = 'region' | 'section' | 'media';

export interface LicenseBadgeProps {
  placement: LicensePlacement;
  divider?: boolean;
  license: License;
  copyright?: string | null;
  light?: boolean;
  style?: StyleProp<ViewStyle>;
}

function LicenseBadge({
  license,
  copyright,
  placement,
  divider,
  light,
  style,
}: LicenseBadgeProps) {
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

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.two,
  },
  logo: {
    marginTop: Spacing.three,
  },
  textLight: {
    color: '#ffffff',
  },
});

export default memo(LicenseBadge);
