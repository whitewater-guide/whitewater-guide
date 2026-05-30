import type { BannerWithSourceFragment } from '@whitewater-guide/schema';
import { Image } from 'expo-image';
import { useCallback } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import {
  Linking,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import theme from '../../theme';
import aspectRatios from './aspectRatios';

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.componentBorder,
  },
  image: {
    alignSelf: 'stretch',
  },
});

interface Props {
  banner: BannerWithSourceFragment;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

function ImageBanner({ banner, style, onPress }: Props) {
  const { placement, extras, source, link } = banner;

  const handlePress = useCallback(() => {
    if (link) {
      onPress?.();
      Linking.openURL(link).catch(() => {});
    }
  }, [onPress, link]);

  return (
    <View
      style={[styles.container, aspectRatios[placement], style, extras?.style]}
    >
      <TouchableWithoutFeedback onPress={handlePress}>
        <Image
          source={{ uri: source.url }}
          contentFit="cover"
          style={[styles.image, aspectRatios[placement]]}
        />
      </TouchableWithoutFeedback>
    </View>
  );
}

export default ImageBanner;
