import React from 'react';
import PropTypes from 'prop-types';
import { Animated, PanResponder, View } from 'react-native';

export const THUMB_SCALE_RATIO = 1.3;

export default class Thumb extends React.PureComponent {
  static propTypes = {
    ...View.propTypes,
    onGrant: PropTypes.func.isRequired,
    onMove: PropTypes.func.isRequired,
    onEnd: PropTypes.func.isRequired,
    color: PropTypes.string.isRequired,
    radius: PropTypes.number.isRequired,
    trackMargin: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);
    this.x = 0;

    this._panResponder = {};
    this._animatedLeft = new Animated.Value(0);
    this._animatedScale = new Animated.Value(1);

    const touchPadding = Math.max(0, 20 - props.radius);
    this._hitSlop = { top: touchPadding, left: touchPadding, bottom: touchPadding, right: touchPadding };
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderTerminationRequest: () => false,
      onShouldBlockNativeResponder: () => true,

      onPanResponderGrant: e => this.props.onGrant(this, e),
      onPanResponderMove: e => this.props.onMove(this, e),
      onPanResponderRelease: e => this.props.onEnd(this, e),
      onPanResponderTerminate: e => this.props.onEnd(this, e),
    });
  }

  moveTo = (x) => {
    this.x = x;
    const xTo = x + this.props.trackMargin;
    Animated.parallel([
      Animated.timing(this._animatedScale, { toValue: THUMB_SCALE_RATIO, duration: 100 }),
      Animated.timing(this._animatedLeft, { toValue: xTo - this.props.radius, duration: 0 }),
    ]).start();
  };

  release = () => {
    Animated.timing(this._animatedScale, { toValue: 1, duration: 100 }).start();
  };

  render() {
    const { color, radius } = this.props;
    return (
      <Animated.View
        style={[
          this.props.style,
          {
            width: 2 * radius,
            height: 2 * radius,
            backgroundColor: color,
            borderRadius: radius,
            position: 'absolute',
            left: this._animatedLeft,
            transform: [
              { scale: this._animatedScale },
            ],
          },
        ]}
        {...this._panResponder.panHandlers}
        hitSlop={this._hitSlop}
      />
    );
  }
}
