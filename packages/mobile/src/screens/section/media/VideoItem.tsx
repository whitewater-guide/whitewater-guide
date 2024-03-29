import type { VideoThumb } from '@whitewater-guide/clients';
import { getVideoThumb } from '@whitewater-guide/clients';
import FastImage from '@whitewater-guide/react-native-fast-image';
import type { MediaWithThumbFragment } from '@whitewater-guide/schema';
import React from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { Caption, Paragraph, TouchableRipple } from 'react-native-paper';

import { Row } from '~/components/Row';
import { trackError } from '~/core/errors';
import { PHOTO_PADDING, PHOTO_SIZE } from '~/features/media';
import copyAndToast from '~/utils/copyAndToast';

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
  video: MediaWithThumbFragment;
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
    Linking.openURL(this.props.video.url).catch(() => {
      // do not care if we cannot open it
    });
  };

  onLongPress = () => copyAndToast(this.props.video.url);

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
