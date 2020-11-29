import analytics from '@react-native-firebase/analytics';
import { Banner, BannerKind } from '@whitewater-guide/commons';
import React, { useCallback } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import ImageBanner from './ImageBanner';
import WebViewBanner from './WebViewBanner';

interface Props {
  banner: Banner;
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
}

export const BannerView: React.FC<Props> = (props) => {
  const { banner, containerStyle } = props;
  const {
    slug,
    source: { kind },
    extras,
  } = banner;

  const onPress = useCallback(() => {
    analytics().logEvent(`Banner_${slug}`, {});
  }, [slug]);

  const BannerComponent =
    kind === BannerKind.Image ? ImageBanner : WebViewBanner;

  return (
    <View style={[containerStyle, extras?.containerStyle]}>
      <BannerComponent {...props} onPress={onPress} />
    </View>
  );
};
