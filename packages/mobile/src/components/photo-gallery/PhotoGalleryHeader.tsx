import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

import theme from '../../theme';
import Icon from '../Icon';

const styles = StyleSheet.create({
  headerOuter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.32)',
  },
  headerInner: {
    height: 32,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 8,
  },
});

interface Props {
  onClose: () => void;
}

const PhotoGalleryHeader: React.FC<Props> = ({ onClose }) => {
  return (
    <View style={styles.headerOuter}>
      <SafeAreaView />
      <View style={styles.headerInner}>
        <Icon
          large={true}
          icon="close"
          onPress={onClose}
          color={theme.colors.textLight}
        />
      </View>
    </View>
  );
};

PhotoGalleryHeader.displayName = 'PhotoGalleryHeader';

export default PhotoGalleryHeader;
