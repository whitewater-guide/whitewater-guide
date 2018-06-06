import React from 'react';
import { StyleSheet } from 'react-native';
import FastImage, { FastImageProperties, OnProgressEvent } from 'react-native-fast-image';
import { ProgressBar } from 'react-native-paper';
import theme from '../../../theme';

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

class LoadableImage extends React.PureComponent<FastImageProperties, State> {
  state: State = {
    progress: 0,
    showProgress: false,
  };

  timeout: number;

  componentDidMount() {
    this.timeout = setTimeout(this.showProgress, 200) as any;
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  showProgress = () => this.setState({ showProgress: true });

  onProgress = (e: OnProgressEvent) => this.setState({ progress: e.nativeEvent.loaded / e.nativeEvent.total });

  onLoadEnd = () => clearTimeout(this.timeout);

  render() {
    const { progress, showProgress } = this.state;
    return (
      <FastImage {...this.props} onProgress={this.onProgress} onLoadEnd={this.onLoadEnd} onLoad={this.onLoadEnd}>
        {
          showProgress && progress !== 1 &&
          (
            <ProgressBar progress={progress} color={theme.colors.primary} style={styles.bar} />
          )
        }
      </FastImage>
    );
  }
}

export default LoadableImage;