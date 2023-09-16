import type {
  FastImageProps,
  OnProgressEvent,
} from '@whitewater-guide/react-native-fast-image';
import FastImage from '@whitewater-guide/react-native-fast-image';
import React from 'react';
import { StyleSheet } from 'react-native';
import { ProgressBar } from 'react-native-paper';

import theme from '../../theme';

const styles = StyleSheet.create({
  bar: {
    width: theme.screenWidth * 0.75,
    alignSelf: 'center',
  },
});

interface State {
  progress: number;
  showProgress: boolean;
}

class LoadableImage extends React.PureComponent<FastImageProps, State> {
  state: State = {
    progress: 0,
    showProgress: false,
  };

  timeout = NaN;

  componentDidMount() {
    this.timeout = setTimeout(this.showProgress, 200) as any;
  }

  componentWillUnmount() {
    if (!isNaN(this.timeout)) {
      clearTimeout(this.timeout);
    }
  }

  showProgress = () => this.setState({ showProgress: true });

  onProgress = (e: OnProgressEvent) =>
    this.setState({ progress: e.nativeEvent.loaded / e.nativeEvent.total });

  onLoadEnd = () => clearTimeout(this.timeout);

  render() {
    const { progress, showProgress } = this.state;
    return (
      <FastImage
        {...this.props}
        onProgress={this.onProgress}
        onLoadEnd={this.onLoadEnd}
        onLoad={this.onLoadEnd}
      >
        {showProgress && progress !== 1 && (
          <ProgressBar
            progress={progress}
            color={theme.colors.primary}
            style={styles.bar}
          />
        )}
      </FastImage>
    );
  }
}

export default LoadableImage;
