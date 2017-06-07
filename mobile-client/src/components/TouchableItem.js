import React, { Children } from 'react';
import PropTypes from 'prop-types';
import { Platform, TouchableNativeFeedback, TouchableOpacity, View } from 'react-native';

const ANDROID_VERSION_LOLLIPOP = 21;

export default class TouchableItem extends React.PureComponent {
  static propTypes = {
    onPress: PropTypes.func.isRequired,
    delayPressIn: PropTypes.number,
    pressColor: PropTypes.string,
    activeOpacity: PropTypes.number,
    children: PropTypes.any,
    style: PropTypes.any,
  };

  static defaultProps = {
    pressColor: 'rgba(0, 0, 0, .32)',
  };

  render() {
    const { style, borderless, pressColor, children, ...rest } = this.props;
    if (Platform.OS === 'android' && Platform.Version >= ANDROID_VERSION_LOLLIPOP) {
      return (
        <TouchableNativeFeedback
          {...rest}
          background={TouchableNativeFeedback.Ripple(pressColor, borderless)}
        >
          <View style={style}>
            {Children.only(children)}
          </View>
        </TouchableNativeFeedback>
      );
    }

    return (
      <TouchableOpacity style={style} {...rest}>
        { children }
      </TouchableOpacity>
    );
  }
}
