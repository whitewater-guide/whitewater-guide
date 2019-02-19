import { Banner } from '@whitewater-guide/commons';
import React from 'react';
import { Linking, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
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
  banner: Banner;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

class WebViewBanner extends React.PureComponent<Props> {
  private _webView: WebView | null = null;

  setRef = (ref: WebView | null) => {
    this._webView = ref;
  };

  onNavigationStateChange = ({ url }: WebViewNavigation) => {
    const { banner, onPress } = this.props;
    if (this._webView && url !== banner.source.src) {
      this._webView.stopLoading();
      try {
        Linking.openURL(url);
        if (onPress) {
          onPress();
        }
      } catch (e) {
        /*ignore*/
      }
    }
  };

  render() {
    const { banner } = this.props;
    const { extras, placement, source } = banner;
    return (
      <View style={[styles.container, aspectRatios[placement]]}>
        <WebView
          ref={this.setRef}
          source={{ uri: source.src! }}
          style={[
            styles.webview,
            aspectRatios[placement],
            extras && extras.style,
          ]}
          onNavigationStateChange={this.onNavigationStateChange}
        />
      </View>
    );
  }
}

export default WebViewBanner;
