import type { BannerWithSourceFragment } from '@whitewater-guide/schema';
import { useRef } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Linking, StyleSheet, View } from 'react-native';
import type { WebView as WebViewType } from 'react-native-webview';
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

function WebViewBanner({ banner, style, onPress }: Props) {
  const { extras, placement, source } = banner;
  const webViewRef = useRef<WebViewType>(null);

  if (!source.url) {
    return null;
  }

  return (
    <View style={[styles.container, aspectRatios[placement], style]}>
      <WebView
        ref={webViewRef}
        source={{ uri: source.url }}
        style={[styles.webview, aspectRatios[placement], extras?.style]}
        onNavigationStateChange={({ url }) => {
          if (url !== source.url) {
            webViewRef.current?.stopLoading();
            Linking.openURL(url).catch(() => {});
            onPress?.();
          }
        }}
      />
    </View>
  );
}

export default WebViewBanner;
