import React from 'react';
import { Animated, GestureResponderEvent, Insets, PanResponder, PanResponderInstance, ViewProps } from 'react-native';

export const THUMB_SCALE_RATIO = 1.3;

interface Props extends ViewProps {
  onGrant: (thumb: Thumb, e: GestureResponderEvent) => void;
  onMove: (thumb: Thumb, e: GestureResponderEvent) => void;
  onEnd: (thumb: Thumb, e: GestureResponderEvent) => void;
  color: string;
  radius: number;
  trackMargin: number;
}

export default class Thumb extends React.PureComponent<Props> {
  x: number = 0;
  _panResponder: PanResponderInstance;
  _animatedLeft: Animated.Value = new Animated.Value(0);
  _animatedScale: Animated.Value = new Animated.Value(1);
  _hitSlop: Insets;

  constructor(props: Props) {
    super(props);
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

      onPanResponderGrant: (e) => this.props.onGrant(this, e),
      onPanResponderMove: (e) => this.props.onMove(this, e),
      onPanResponderRelease: (e) => this.props.onEnd(this, e),
      onPanResponderTerminate: (e) => this.props.onEnd(this, e),
    });
  }

  moveTo = (x: number) => {
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
