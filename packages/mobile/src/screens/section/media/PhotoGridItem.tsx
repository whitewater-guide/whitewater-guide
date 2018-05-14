import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { getThumbUri, PHOTO_PADDING, PHOTO_SIZE } from './MediaConstants';

const styles = StyleSheet.create({
  image: {
    margin: PHOTO_PADDING / 2,
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
  },
});

interface Props {
  url: string;
  index: number;
  onPress: (index: number) => void;
}

class PhotoGridItem extends React.PureComponent<Props> {
  onPress = () => this.props.onPress(this.props.index);

  render() {
    const { url } = this.props;
    return (
      <TouchableOpacity key={url} onPress={this.onPress}>
        <FastImage source={getThumbUri(url)} style={styles.image} />
      </TouchableOpacity>
    );
  }
}

export default PhotoGridItem;
