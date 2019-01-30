import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { analytics } from 'react-native-firebase';
import { Banner, BannerKind } from '@whitewater-guide/commons';
import ImageBanner from './ImageBanner';
import WebViewBanner from './WebViewBanner';

interface Props {
  banner: Banner;
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
}

export class BannerView extends React.PureComponent<Props> {
  onPress = () => {
    analytics().logEvent(`Banner_${this.props.banner.slug}`);
  };

  renderBanner = () => {
    const { banner } = this.props;
    if (banner.source.kind === BannerKind.Image) {
      return <ImageBanner {...this.props} onPress={this.onPress} />;
    }
    return <WebViewBanner {...this.props} onPress={this.onPress} />;
  };

  render() {
    const {
      containerStyle,
      banner: { extras },
    } = this.props;
    return (
      <View style={[containerStyle, extras && extras.containerStyle]}>
        {this.renderBanner()}
      </View>
    );
  }
}
