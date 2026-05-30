import type { BannerWithSourceFragment } from '@whitewater-guide/schema';
import { BannerKind } from '@whitewater-guide/schema';
import { useCallback } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { View } from 'react-native';

import { trackEvent } from '../../core/analytics';
import ImageBanner from './ImageBanner';
import WebViewBanner from './WebViewBanner';

interface Props {
  banner: BannerWithSourceFragment;
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
}

export function BannerView({ banner, containerStyle, style }: Props) {
  const { slug, source, extras } = banner;

  const onPress = useCallback(() => {
    trackEvent(`Banner_${slug}`.replaceAll('-', '_'));
  }, [slug]);

  const BannerComponent =
    source.kind === BannerKind.Image ? ImageBanner : WebViewBanner;

  return (
    <View style={[containerStyle, extras?.containerStyle]}>
      <BannerComponent banner={banner} style={style} onPress={onPress} />
    </View>
  );
}
