import type { License } from '@whitewater-guide/schema';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated';

import { Icon } from '@/components/icon';
import LicenseLogo from '@/components/license-logo';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { isLicenseWithLogo, ROOT_LICENSE } from '@/features/licenses';

import type { GalleryPhoto } from './photo-gallery-item';

export interface PhotoGalleryFooterProps {
  photo?: GalleryPhoto;
  sectionLicense?: License;
}

function PhotoGalleryFooter({ photo, sectionLicense }: PhotoGalleryFooterProps) {
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
            color="#ffffff"
            style={styles.chevron}
          />
        )}
        <ThemedText style={styles.description}>
          {description}
          {copyright && (
            <ThemedText style={styles.copyright}>{`\n © ${copyright}`}</ThemedText>
          )}
        </ThemedText>
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
    color: '#ffffff',
    fontSize: 16,
  },
  copyright: {
    color: '#ffffff',
    fontSize: 12,
  },
  chevron: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? -8 : 0,
    right: Spacing.one,
  },
});

PhotoGalleryFooter.displayName = 'PhotoGalleryFooter';

export default PhotoGalleryFooter;
