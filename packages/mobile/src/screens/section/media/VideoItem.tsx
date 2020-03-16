import { getVideoThumb, VideoThumb } from '@whitewater-guide/clients';
import { Media } from '@whitewater-guide/commons';
import React from 'react';
import { Clipboard, Linking, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Caption, Paragraph, TouchableRipple } from 'react-native-paper';
import { Row } from '~/components/Row';
import { trackError } from '../../../core/errors';
import { PHOTO_PADDING, PHOTO_SIZE } from '../../../features/media';
import VideoThumbPlaceholder from './VideoThumbPlaceholder';

const styles = StyleSheet.create({
  container: {
    padding: PHOTO_PADDING / 2,
    height: PHOTO_SIZE + 2 * PHOTO_PADDING,
    borderBottomWidth: undefined,
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
  },
});

interface Props {
  video: Media;
}

interface State {
  thumb: string | null;
}

class VideoItem extends React.PureComponent<Props, State> {
  private _mounted = false;

  state: State = { thumb: null };

  async componentDidMount() {
    this._mounted = true;
    let thumb: VideoThumb | null = null;
    try {
      thumb = await getVideoThumb(this.props.video.url, PHOTO_SIZE);
    } catch (e) {
      trackError('VideoItem', e);
    }
    if (this._mounted) {
      this.setState({ thumb: thumb ? thumb.thumb : null });
    }
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  onPress = () => {
    Linking.openURL(this.props.video.url).catch(() => {});
  };

  onLongPress = () => Clipboard.setString(this.props.video.url);

  renderThumb = () => {
    const { thumb } = this.state;
    if (thumb) {
      return (
        <FastImage
          source={{ uri: this.state.thumb || '' }}
          style={styles.image}
          resizeMode="cover"
        />
      );
    }
    return <VideoThumbPlaceholder />;
  };

  render() {
    const { description, copyright } = this.props.video;
    return (
      <TouchableRipple onPress={this.onPress} onLongPress={this.onLongPress}>
        <Row style={styles.container}>
          {this.renderThumb()}
          <View style={styles.body}>
            <Paragraph
              style={styles.description}
              numberOfLines={copyright ? 3 : 4}
            >
              {description}
            </Paragraph>
            {copyright && <Caption>{`© ${copyright}`}</Caption>}
          </View>
        </Row>
      </TouchableRipple>
    );
  }
}

export default VideoItem;
