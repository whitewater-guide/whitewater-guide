import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import theme from '../../theme';

const styles = StyleSheet.create({
  indicator: {
    position: 'absolute',
    top: 0,
    left: 60,
    right: 60,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    zIndex: 20,
  },
  indicatorText: {
    color: theme.colors.textLight,
  },
});

interface Props {
  index: number;
  total: number;
}

const PhotoGalleryIndicator: React.FC<Props> = ({ index, total }) => (
  <View style={styles.indicator}>
    <Text style={styles.indicatorText}>{`${index}/${total}`}</Text>
  </View>
);

PhotoGalleryIndicator.displayName = 'PhotoGalleryIndicator';

export default PhotoGalleryIndicator;
