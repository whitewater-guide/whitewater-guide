import React from 'react';
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
import { Banner } from '@whitewater-guide/commons';
import aspectRatios from './aspectRatios';
import { getBannerURL } from './getBannerURL';

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

export default class ImageBanner extends React.PureComponent<Props> {
  onPress = async () => {
    const {
      banner: { link },
      onPress,
    } = this.props;
    if (!link) {
      return;
    }
    if (onPress) {
      onPress();
    }

    // TODO: track event
    try {
      Linking.openURL(link);
    } catch (e) {
      /*Ignore*/
    }
  };

  render() {
    const { banner, style } = this.props;
    const { placement, extras, source } = banner;
    const uri = getBannerURL(source.src!);
    return (
      <View
        style={[
          styles.container,
          aspectRatios[placement],
          style,
          extras && extras.style,
        ]}
      >
        <TouchableWithoutFeedback onPress={this.onPress}>
          <FastImage
            source={{ uri }}
            style={[styles.image, aspectRatios[placement]]}
          />
        </TouchableWithoutFeedback>
      </View>
    );
  }
}
