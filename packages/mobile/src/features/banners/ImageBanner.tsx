import FastImage from '@whitewater-guide/react-native-fast-image';
import { BannerWithSourceFragment } from '@whitewater-guide/schema';
import React, { useCallback } from 'react';
import {
  Linking,
  StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
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

const ImageBanner: React.FC<Props> = (props) => {
  const { banner, style, onPress } = props;
  const { placement, extras, source, link } = banner;

  const handlePress = useCallback(() => {
    if (link) {
      onPress?.();
      Linking.openURL(link).catch(() => {
        // do not care if it fails
      });
    }
  }, [onPress, link]);

  return (
    <View
      style={[styles.container, aspectRatios[placement], style, extras?.style]}
    >
      <TouchableWithoutFeedback onPress={handlePress}>
        <FastImage
          source={{ uri: source.url }}
          style={[styles.image, aspectRatios[placement]]}
        />
      </TouchableWithoutFeedback>
    </View>
  );
};

export default ImageBanner;
