import React from 'react';
import { Linking, StyleProp, StyleSheet, TouchableWithoutFeedback, View, ViewStyle } from 'react-native';
import FastImage from 'react-native-fast-image';
import theme from '../../theme';
import { Banner } from '../../ww-commons';
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
    const { banner: { link }, onPress } = this.props;
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
    const uri = getBannerURL(banner.source.src!);
    return (
      <View style={[styles.container, aspectRatios[banner.placement], style]}>
        <TouchableWithoutFeedback onPress={this.onPress}>
          <FastImage
            source={{ uri }}
            style={[styles.image, aspectRatios[banner.placement]]}
          />
        </TouchableWithoutFeedback>
      </View>
    );
  }
}
