import { Media, MediaKind } from '@whitewater-guide/commons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { PHOTO_PADDING, PHOTO_SIZE } from '../../../features/media';
import NoMedia from './NoMedia';
import PhotoGridItem from './PhotoGridItem';

const styles = StyleSheet.create({
  grid: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: PHOTO_PADDING / 2,
  },
  image: {
    margin: PHOTO_PADDING / 2,
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
  },
});

interface Props {
  photos?: Media[];
  onPress: (index: number) => void;
}

const PhotoGrid: React.FC<Props> = ({ photos, onPress }) => {
  if (!photos || photos.length === 0) {
    return <NoMedia kind={MediaKind.photo} />;
  }
  return (
    <View style={styles.grid}>
      {photos.map(({ image, thumb }, index) => (
        <PhotoGridItem
          key={index}
          image={image!}
          thumb={thumb!}
          index={index}
          onPress={onPress}
        />
      ))}
    </View>
  );
};

export default PhotoGrid;
