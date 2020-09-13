import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

interface Props {
  topSpacing?: number;
  onToggle?: (isOpen: boolean, space: number) => void;
  style?: StyleProp<ViewStyle>;
}

// Based on https://github.com/Andr3wHur5t/react-native-keyboard-spacer
const KeyboardSpacerAndroid: React.FC<Props> = React.memo(() => null);

KeyboardSpacerAndroid.displayName = 'KeyboardSpacerAndroid';

export default KeyboardSpacerAndroid;
