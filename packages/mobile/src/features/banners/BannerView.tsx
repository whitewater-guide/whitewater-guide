import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { analytics } from 'react-native-firebase';
import theme from '../../theme';
import { Banner, BannerKind, BannerPlacement } from '../../ww-commons';
import ImageBanner from './ImageBanner';
import WebViewBanner from './WebViewBanner';

const styles = StyleSheet.create({
  bannerContainer: {
    marginVertical: theme.margin.double,
  },
  bannerSectionsRow: {
    height: 72,
  },
});

interface Props {
  banner: Banner;
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
    const { banner: { placement } } = this.props;
    const style = placement === BannerPlacement.MOBILE_SECTION_ROW ? styles.bannerSectionsRow : styles.bannerContainer;
    return (
      <View style={style}>
        {this.renderBanner()}
      </View>
    );
  }
}
