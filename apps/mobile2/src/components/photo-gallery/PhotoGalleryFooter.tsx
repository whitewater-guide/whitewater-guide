import { isLicenseWithLogo, ROOT_LICENSE } from '@whitewater-guide/clients';
import type { License, Media } from '@whitewater-guide/schema';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated';

import theme from '../../theme';
import Icon from '../Icon';
import LicenseLogo from '../LicenseLogo';

interface Props {
  photo?: Media;
  sectionLicense?: License;
}

function PhotoGalleryFooter({ photo, sectionLicense }: Props) {
  const [licenseOpen, setLicenseOpen] = useState(false);

  if (!photo) {
    return <View />;
  }

  const { description, copyright } = photo;
  const license = photo.license ?? sectionLicense ?? ROOT_LICENSE;
  const licenseOnly = !description && !copyright;

  const onToggle = licenseOnly
    ? undefined
    : () => setLicenseOpen((prev) => !prev);

  return (
    <Pressable onPress={onToggle}>
      <Animated.View layout={LinearTransition}>
        {!licenseOnly && isLicenseWithLogo(license) && (
          <Icon
            narrow
            icon={licenseOpen ? 'chevron-down' : 'chevron-up'}
            color={theme.colors.textLight}
            style={styles.chevron}
          />
        )}
        <Text style={styles.description}>
          {description}
          {copyright && (
            <Text style={styles.copyright}>{`\n © ${copyright}`}</Text>
          )}
        </Text>
        {(licenseOnly || licenseOpen) && (
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <LicenseLogo license={license} />
          </Animated.View>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  description: {
    flex: 1,
    color: theme.colors.textLight,
    fontSize: 16,
  },
  copyright: {
    color: theme.colors.textLight,
    fontSize: 12,
  },
  chevron: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? -8 : 0,
    right: theme.margin.half,
  },
});

PhotoGalleryFooter.displayName = 'PhotoGalleryFooter';

export default PhotoGalleryFooter;
