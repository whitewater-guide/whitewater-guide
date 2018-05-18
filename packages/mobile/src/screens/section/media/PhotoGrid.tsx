import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Media, MediaKind } from '../../../ww-commons';
import { PHOTO_PADDING, PHOTO_SIZE } from './MediaConstants';
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

const PhotoGrid: React.SFC<Props> = ({ photos, onPress }) => {
  if (!photos || photos.length === 0) {
    return (
      <NoMedia kind={MediaKind.photo} />
    );
  }
  return (
    <View style={styles.grid}>
      { photos.map(({ url }, index) => (
        <PhotoGridItem key={index} url={url} index={index} onPress={onPress} />
      ))}
    </View>
  );
};

export default PhotoGrid;