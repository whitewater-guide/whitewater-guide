import { BannerWithSourceFragment } from '@whitewater-guide/schema';
import React from 'react';
import { Linking, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { WebView } from 'react-native-webview';

import theme from '../../theme';
import aspectRatios from './aspectRatios';

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.componentBorder,
  },
  webview: {
    alignSelf: 'stretch',
  },
});

interface Props {
  banner: BannerWithSourceFragment;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

class WebViewBanner extends React.PureComponent<Props> {
  private _webView: WebView | null = null;

  setRef = (ref: WebView | null) => {
    this._webView = ref;
  };

  onNavigationStateChange = ({ url }: any) => {
    const { banner, onPress } = this.props;
    if (this._webView && url !== banner.source.url) {
      this._webView.stopLoading();
      try {
        Linking.openURL(url);
        if (onPress) {
          onPress();
        }
      } catch (e) {
        /* ignore */
      }
    }
  };

  render() {
    const { banner } = this.props;
    const { extras, placement, source } = banner;
    if (!source.url) {
      return null;
    }
    return (
      <View style={[styles.container, aspectRatios[placement]]}>
        <WebView
          ref={this.setRef}
          source={{ uri: source.url }}
          style={[styles.webview, aspectRatios[placement], extras?.style]}
          onNavigationStateChange={this.onNavigationStateChange}
        />
      </View>
    );
  }
}

export default WebViewBanner;
