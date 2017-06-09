import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import CachedImage from 'react-native-cached-image';
import { PHOTO_PADDING, PHOTO_SIZE, getThumbUri } from './MediaConstants';
import NoMedia from './NoMedia';

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

const PhotoGrid = ({ photos, onPress }) => {
  if (!photos || photos.length === 0) {
    return (
      <NoMedia type="photos" />
    );
  }
  return (
    <View style={styles.grid}>
      { photos.map(({ url }, index) => (
        <TouchableOpacity key={url} onPress={() => onPress(index)}>
          <CachedImage source={getThumbUri(url)} style={styles.image} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

PhotoGrid.propTypes = {
  photos: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string,
    url: PropTypes.string,
    copyright: PropTypes.string,
    description: PropTypes.string,
  })),
  onPress: PropTypes.func.isRequired,
};

PhotoGrid.defaultProps = {
  photos: null,
};

export default PhotoGrid;
