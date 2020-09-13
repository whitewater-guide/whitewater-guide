import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardEventListener,
  LayoutAnimation,
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

interface Props {
  topSpacing?: number;
  onToggle?: (isOpen: boolean, space: number) => void;
  style?: StyleProp<ViewStyle>;
}

// Based on https://github.com/Andr3wHur5t/react-native-keyboard-spacer
const KeyboardSpacerIos: React.FC<Props> = React.memo(
  ({ topSpacing = 0, style, onToggle }) => {
    const [state, setState] = useState({
      keyboardSpace: 0,
      isKeyboardOpened: false,
    });

    useEffect(() => {
      const updateListener: KeyboardEventListener = (e) => {
        if (!e.endCoordinates) {
          return;
        }

        LayoutAnimation.configureNext(
          LayoutAnimation.create(
            e.duration,
            LayoutAnimation.Types[e.easing],
            LayoutAnimation.Properties.opacity,
          ),
        );

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

      const resetListener: KeyboardEventListener = (e) => {
        LayoutAnimation.configureNext(
          LayoutAnimation.create(
            e.duration,
            LayoutAnimation.Types[e.easing],
            LayoutAnimation.Properties.opacity,
          ),
        );

        setState({
          keyboardSpace: 0,
          isKeyboardOpened: false,
        });
      };
      Keyboard.addListener('keyboardWillShow', updateListener);
      Keyboard.addListener('keyboardWillHide', resetListener);

      return () => {
        Keyboard.removeListener('keyboardWillShow', updateListener);
        Keyboard.removeListener('keyboardWillHide', resetListener);
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

KeyboardSpacerIos.displayName = 'KeyboardSpacerIos';

export default KeyboardSpacerIos;
