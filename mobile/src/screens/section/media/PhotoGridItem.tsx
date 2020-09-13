import React from 'react';
import { Clipboard, StyleSheet, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';

import { PHOTO_PADDING, PHOTO_SIZE } from '../../../features/media';

const styles = StyleSheet.create({
  image: {
    margin: PHOTO_PADDING / 2,
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
  },
});

interface Props {
  image: string;
  thumb: string;
  index: number;
  onPress: (index: number) => void;
}

class PhotoGridItem extends React.PureComponent<Props> {
  onPress = () => this.props.onPress(this.props.index);

  onLongPress = () => Clipboard.setString(this.props.image);

  render() {
    const { thumb } = this.props;
    return (
      <TouchableOpacity
        key={thumb}
        onPress={this.onPress}
        onLongPress={this.onLongPress}
      >
        <FastImage source={{ uri: thumb }} style={styles.image} />
      </TouchableOpacity>
    );
  }
}

export default PhotoGridItem;
