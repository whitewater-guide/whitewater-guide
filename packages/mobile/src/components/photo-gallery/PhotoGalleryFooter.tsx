import { License } from '@whitewater-guide/commons';
import React from 'react';
import {
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import useBoolean from 'react-use/lib/useBoolean';

import LicenseBadge from '~/components/LicenseBadge';

import theme from '../../theme';
import Icon from '../Icon';
import { PhotoGalleryItem } from './types';

const styles = StyleSheet.create({
  footerDescription: {
    flex: 1,
    color: theme.colors.textLight,
    fontSize: 16,
  },
  footerCopyright: {
    color: theme.colors.textLight,
    fontSize: 12,
  },
  licenseBadge: {
    marginHorizontal: theme.margin.half,
  },
  chevron: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? -8 : 0,
    right: theme.margin.half,
  },
});

interface Props {
  index?: number;
  photos?: PhotoGalleryItem[];
  sectionLicense: License;
}

const PhotoGalleryFooter: React.FC<Props> = (props) => {
  const { index, photos, sectionLicense } = props;
  const [licenseOpen, toggleLicenseOpen] = useBoolean(false);
  // There's a bug in react-native-image-viewer where it returns -1 index
  const photo = photos?.[Math.max(0, index ?? 0)];
  if (!photo) {
    return <View />;
  }
  const { description, copyright } = photo;
  const licenseOnly = !description && !copyright;
  const onToggle = licenseOnly
    ? undefined
    : () => {
        LayoutAnimation.easeInEaseOut();
        toggleLicenseOpen();
      };

  return (
    <TouchableWithoutFeedback onPress={onToggle}>
      <View>
        {!licenseOnly && (
          <Icon
            narrow
            icon={licenseOpen ? 'chevron-down' : 'chevron-up'}
            color={theme.colors.textLight}
            style={styles.chevron}
          />
        )}
        <Text style={styles.footerDescription}>
          {description}
          {copyright && (
            <Text style={styles.footerCopyright}>{`\n © ${copyright}`}</Text>
          )}
        </Text>
        {(licenseOnly || licenseOpen) && (
          <LicenseBadge
            light
            placement="media"
            license={photo.license ?? sectionLicense}
            style={styles.licenseBadge}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

PhotoGalleryFooter.displayName = 'PhotoGalleryFooter';

export default PhotoGalleryFooter;
