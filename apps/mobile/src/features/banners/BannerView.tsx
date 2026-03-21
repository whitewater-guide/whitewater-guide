import analytics from '@react-native-firebase/analytics';
import type { BannerWithSourceFragment } from '@whitewater-guide/schema';
import { BannerKind } from '@whitewater-guide/schema';
import React, { useCallback } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { View } from 'react-native';

import ImageBanner from './ImageBanner';
import WebViewBanner from './WebViewBanner';

interface Props {
  banner: BannerWithSourceFragment;
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
    const eventName = `Banner_${slug}`.replaceAll('-', '_');
    try {
      analytics().logEvent(eventName, {});
    } catch {}
  }, [slug]);

  const BannerComponent =
    kind === BannerKind.Image ? ImageBanner : WebViewBanner;

  return (
    <View style={[containerStyle, extras?.containerStyle]}>
      <BannerComponent {...props} onPress={onPress} />
    </View>
  );
};
