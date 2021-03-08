import React from 'react';
import {
  Animated,
  GestureResponderEvent,
  Insets,
  PanResponder,
  PanResponderInstance,
  ViewProps,
} from 'react-native';

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
  x = 0;
  _panResponder: PanResponderInstance | null = null;
  _animatedLeft: Animated.Value = new Animated.Value(0);
  _animatedScale: Animated.Value = new Animated.Value(1);
  _hitSlop: Insets;

  constructor(props: Props) {
    super(props);
    const touchPadding = Math.max(0, 20 - props.radius);
    this._hitSlop = {
      top: touchPadding,
      left: touchPadding,
      bottom: touchPadding,
      right: touchPadding,
    };
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderTerminationRequest: () => false,
      onShouldBlockNativeResponder: () => true,

      onPanResponderGrant: (e) => props.onGrant(this, e),
      onPanResponderMove: (e) => props.onMove(this, e),
      onPanResponderRelease: (e) => props.onEnd(this, e),
      onPanResponderTerminate: (e) => props.onEnd(this, e),
    });
  }

  moveTo = (x: number) => {
    this.x = x;
    const xTo = x + this.props.trackMargin;
    Animated.parallel([
      Animated.timing(this._animatedScale, {
        toValue: THUMB_SCALE_RATIO,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(this._animatedLeft, {
        toValue: xTo - this.props.radius,
        duration: 0,
        useNativeDriver: false,
      }),
    ]).start();
  };

  release = () => {
    Animated.timing(this._animatedScale, {
      toValue: 1,
      duration: 100,
      useNativeDriver: false,
    }).start();
  };

  render() {
    const { color, radius } = this.props;
    const panHandlers = this._panResponder
      ? this._panResponder.panHandlers
      : undefined;
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
            transform: [{ scale: this._animatedScale }],
          },
        ]}
        {...panHandlers}
        hitSlop={this._hitSlop}
      />
    );
  }
}
