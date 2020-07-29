import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardEventListener,
  LayoutAnimation,
  LayoutAnimationConfig,
  Platform,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import useUpdateEffect from 'react-use/lib/useUpdateEffect';
import theme from '~/theme';

const styles = StyleSheet.create({
  container: {
    left: 0,
    right: 0,
    bottom: 0,
  },
});

// From: https://medium.com/man-moon/writing-modern-react-native-ui-e317ff956f02
const defaultAnimation: LayoutAnimationConfig = {
  duration: 500,
  create: {
    duration: 300,
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  },
  update: {
    type: LayoutAnimation.Types.spring,
    springDamping: 200,
  },
};

interface Props {
  topSpacing?: number;
  onToggle?: (isOpen: boolean, space: number) => void;
  style?: StyleProp<ViewStyle>;
}

// Based on https://github.com/Andr3wHur5t/react-native-keyboard-spacer
const KeyboardSpacer: React.FC<Props> = React.memo(
  ({ topSpacing = 0, style, onToggle }) => {
    const [state, setState] = useState({
      keyboardSpace: 0,
      isKeyboardOpened: false,
    });

    useEffect(() => {
      const { OS } = Platform;
      const updateEvent = OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
      const updateListener: KeyboardEventListener = (e) => {
        if (!e.endCoordinates) {
          return;
        }

        let animationConfig = defaultAnimation;
        if (OS === 'ios') {
          animationConfig = LayoutAnimation.create(
            e.duration,
            LayoutAnimation.Types[e.easing],
            LayoutAnimation.Properties.opacity,
          );
        }
        LayoutAnimation.configureNext(animationConfig);

        // get updated on rotation
        // when external physical keyboard is connected
        // event.endCoordinates.height still equals virtual keyboard height
        // however only the keyboard toolbar is showing if there should be one
        const keyboardSpace =
          theme.screenHeight - e.endCoordinates.screenY + topSpacing;
        setState({
          keyboardSpace,
          isKeyboardOpened: true,
        });
      };

      const resetEvent = OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
      const resetListener: KeyboardEventListener = (e) => {
        let animationConfig = defaultAnimation;
        if (OS === 'ios') {
          animationConfig = LayoutAnimation.create(
            e.duration,
            LayoutAnimation.Types[e.easing],
            LayoutAnimation.Properties.opacity,
          );
        }
        LayoutAnimation.configureNext(animationConfig);

        setState({
          keyboardSpace: 0,
          isKeyboardOpened: false,
        });
      };
      Keyboard.addListener(updateEvent, updateListener);
      Keyboard.addListener(resetEvent, resetListener);

      return () => {
        Keyboard.removeListener(updateEvent, updateListener);
        Keyboard.removeListener(resetEvent, resetListener);
      };
    }, [topSpacing, setState]);

    useUpdateEffect(() => {
      onToggle?.(state.isKeyboardOpened, state.keyboardSpace);
    }, [state, onToggle]);

    return (
      <View
        style={[styles.container, { height: state.keyboardSpace }, style]}
      />
    );
  },
);

KeyboardSpacer.displayName = 'KeyboardSpacer';

export default KeyboardSpacer;
