import { Banner } from '@whitewater-guide/commons';
import React, { useCallback } from 'react';
import {
  Linking,
  StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import FastImage from 'react-native-fast-image';

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
  banner: Banner;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

const ImageBanner: React.FC<Props> = (props) => {
  const { banner, style, onPress } = props;
  const { placement, extras, source, link } = banner;

  const handlePress = useCallback(() => {
    if (link) {
      onPress?.();
      Linking.openURL(link).catch(() => {});
    }
  }, [onPress, link]);

  return (
    <View
      style={[
        styles.container,
        aspectRatios[placement],
        style,
        extras && extras.style,
      ]}
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
