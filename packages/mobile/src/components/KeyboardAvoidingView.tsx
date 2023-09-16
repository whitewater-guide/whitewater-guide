import React from 'react';
import type {
  EventSubscription,
  KeyboardEvent,
  LayoutChangeEvent,
  LayoutRectangle,
  StyleProp,
  ViewProps,
  ViewStyle,
} from 'react-native';
import {
  Keyboard,
  LayoutAnimation,
  Platform,
  StyleSheet,
  View,
} from 'react-native';

interface Props extends ViewProps {
  /**
   * Specify how to react to the presence of the keyboard.
   */
  behavior?: 'height' | 'position' | 'padding' | 'none';

  /**
   * Style of the content container when `behavior` is 'position'.
   */
  contentContainerStyle?: StyleProp<ViewStyle>;

  /**
   * Controls whether this `KeyboardAvoidingView` instance should take effect.
   * This is useful when more than one is on the screen. Defaults to true.
   */
  enabled: boolean;

  /**
   * Distance between the top of the user screen and the React Native view. This
   * may be non-zero in some cases. Defaults to 0.
   */
  keyboardVerticalOffset: number;
}

interface State {
  bottom: number;
}

interface ScreenRect {
  screenY: number;
}

/**
 * This is original KeyboardAvoidingView from RN with two patches:
 * https://github.com/facebook/react-native/pull/28798
 * https://github.com/facebook/react-native/pull/29239
 *
 */
export default class KeyboardAvoidingView extends React.Component<
  Props,
  State
> {
  static defaultProps = {
    enabled: true,
    keyboardVerticalOffset: 0,
  };

  _frame: LayoutRectangle | null = null;

  _keyboardEvent: KeyboardEvent | null = null;

  _subscriptions: EventSubscription[] = [];

  viewRef: React.RefObject<any>;

  _initialFrameHeight = 0;

  constructor(props: Props) {
    super(props);
    this.state = { bottom: 0 };
    this.viewRef = React.createRef();
  }

  _relativeKeyboardHeight(keyboardFrame: ScreenRect): number {
    const frame = this._frame;
    if (!frame || !keyboardFrame) {
      return 0;
    }

    const keyboardY = keyboardFrame.screenY - this.props.keyboardVerticalOffset;

    // Calculate the displacement needed for the view such that it
    // no longer overlaps with the keyboard

    // https://github.com/facebook/react-native/pull/29239
    // return Math.max(frame.y + frame.height - keyboardY, 0);
    return Math.max(frame.y + this._initialFrameHeight - keyboardY, 0);
  }

  _onKeyboardChange = (event: KeyboardEvent) => {
    this._keyboardEvent = event;
    this._updateBottomIfNecesarry();
  };

  _onLayout = (event: LayoutChangeEvent) => {
    this._frame = event.nativeEvent.layout;
    // https://github.com/facebook/react-native/pull/28798
    // if (!this._initialFrameHeight) {
    if (this.state.bottom === 0 && this._frame) {
      // save the initial frame height, before the keyboard is visible
      this._initialFrameHeight = this._frame.height;
    }

    this._updateBottomIfNecesarry();
  };

  _updateBottomIfNecesarry = () => {
    if (this._keyboardEvent === null) {
      this.setState({ bottom: 0 });
      return;
    }

    const { duration, easing, endCoordinates } = this._keyboardEvent;
    const height = this._relativeKeyboardHeight(endCoordinates);

    if (this.state.bottom === height) {
      return;
    }

    if (duration && easing) {
      LayoutAnimation.configureNext({
        // We have to pass the duration equal to minimal accepted duration defined here: RCTLayoutAnimation.m
        duration: duration > 10 ? duration : 10,
        update: {
          duration: duration > 10 ? duration : 10,
          type: LayoutAnimation.Types[easing] || 'keyboard',
        },
      });
    }
    this.setState({ bottom: height });
  };

  componentDidMount(): void {
    if (Platform.OS === 'ios') {
      this._subscriptions = [
        Keyboard.addListener('keyboardWillChangeFrame', this._onKeyboardChange),
      ];
    } else {
      this._subscriptions = [
        Keyboard.addListener('keyboardDidHide', this._onKeyboardChange),
        Keyboard.addListener('keyboardDidShow', this._onKeyboardChange),
      ];
    }
  }

  componentWillUnmount(): void {
    this._subscriptions.forEach((subscription) => {
      subscription.remove();
    });
  }

  render(): React.ReactNode {
    const {
      behavior,
      children,
      contentContainerStyle,
      enabled,
      keyboardVerticalOffset: _,
      style,
      ...props
    } = this.props;
    const bottomHeight = enabled ? this.state.bottom : 0;
    let heightStyle;
    switch (behavior) {
      case 'none':
        return <View style={style}>{children}</View>;
      case 'height':
        if (!!this._frame && this.state.bottom > 0) {
          // Note that we only apply a height change when there is keyboard present,
          // i.e. this.state.bottom is greater than 0. If we remove that condition,
          // this.frame.height will never go back to its original value.
          // When height changes, we need to disable flex.
          heightStyle = {
            height: this._initialFrameHeight - bottomHeight,
            flex: 0,
          };
        }
        return (
          <View
            ref={this.viewRef}
            style={StyleSheet.compose(style, heightStyle)}
            onLayout={this._onLayout}
            {...props}
          >
            {children}
          </View>
        );

      case 'position':
        return (
          <View
            ref={this.viewRef}
            style={style}
            onLayout={this._onLayout}
            {...props}
          >
            <View
              style={StyleSheet.compose(contentContainerStyle, {
                bottom: bottomHeight,
              })}
            >
              {children}
            </View>
          </View>
        );

      case 'padding':
        return (
          <View
            ref={this.viewRef}
            style={StyleSheet.compose(style, { paddingBottom: bottomHeight })}
            onLayout={this._onLayout}
            {...props}
          >
            {children}
          </View>
        );

      default:
        return (
          <View
            ref={this.viewRef}
            onLayout={this._onLayout}
            style={style}
            {...props}
          >
            {children}
          </View>
        );
    }
  }
}
