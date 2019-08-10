import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../../theme';
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
});

interface Props {
  index?: number;
  photos?: PhotoGalleryItem[];
}

const PhotoGalleryFooter: React.FC<Props> = ({ index, photos }) => {
  if (index === undefined || !photos) {
    return <View />;
  }
  // There's a bug in react-native-image-viewer where it returns -1 index
  const { description, copyright } = photos[Math.max(0, index)];
  return (
    <React.Fragment>
      <Text style={styles.footerDescription}>
        {description}
        {copyright && (
          <Text style={styles.footerCopyright}>{`\n © ${copyright}`}</Text>
        )}
      </Text>
    </React.Fragment>
  );
};

PhotoGalleryFooter.displayName = 'PhotoGalleryFooter';

export default PhotoGalleryFooter;
