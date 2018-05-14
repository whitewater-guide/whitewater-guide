import React from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { propType } from 'graphql-anywhere';
import CachedImage from 'react-native-cached-image';
import { MediaFragments } from '../../../commons/features/sections';
import getVideoThumb from '../../../commons/utils/getVideoThumb';
import { ListItem, Text } from '../../../components';
import { PHOTO_PADDING, PHOTO_SIZE } from './MediaConstants';

const styles = StyleSheet.create({
  container: {
    padding: PHOTO_PADDING / 2,
    height: PHOTO_SIZE + 2 * PHOTO_PADDING,
  },
  body: {
    flex: 1,
    alignSelf: 'stretch',
    paddingLeft: PHOTO_PADDING / 2,
  },
  image: {
    margin: PHOTO_PADDING / 2,
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
  },
  description: {
    flex: 1,
    fontSize: 14,
  },
});

class VideoItem extends React.PureComponent {

  static propTypes = {
    video: propType(MediaFragments.Core).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      thumb: null,
    };
  }

  async componentDidMount() {
    const thumb = await getVideoThumb(this.props.video.url);
    this.setState({ thumb });
  }

  onPress = () => Linking.openURL(this.props.video.url).catch(() => {});

  render() {
    const { description, copyright } = this.props.video;
    return (
      <ListItem style={styles.container} onPress={this.onPress}>
        <CachedImage source={{ uri: this.state.thumb }} style={styles.image} resizeMode="cover" />
        <View style={styles.body}>
          <Text style={styles.description} numberOfLines={copyright ? 3 : 4}>{description}</Text>
          { copyright && <Text note>{`By: ${copyright}`}</Text> }
        </View>
      </ListItem>
    );
  }
}

export default VideoItem;
