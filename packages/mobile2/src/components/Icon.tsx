import MaterialIcons from '@react-native-vector-icons/material-design-icons';
import type { ComponentProps, Ref } from 'react';
import React from 'react';
import type { StyleProp, TextStyle, View, ViewStyle } from 'react-native';
import { Pressable, StyleSheet } from 'react-native';

import theme from '../theme';

type IconName = ComponentProps<typeof MaterialIcons>['name'];

const styles = StyleSheet.create({
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
  },
  narrow: {
    width: undefined,
    height: undefined,
  },
  wide: {
    width: 45,
    height: 45,
  },
});

interface IconProps {
  ref?: Ref<View>;
  icon: IconName;
  primary?: boolean;
  color?: string;
  size?: number;
  large?: boolean;
  wide?: boolean;
  narrow?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  hitSlop?:
    | number
    | { top?: number; right?: number; bottom?: number; left?: number };
  style?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

function Icon({
  ref,
  icon,
  color,
  primary,
  size = theme.icons.regular,
  large,
  wide,
  narrow,
  onPress,
  onLongPress,
  style,
  iconStyle,
  accessibilityHint,
  accessibilityLabel,
  testID,
  disabled,
  hitSlop,
}: IconProps) {
  const clr = color || (primary ? theme.colors.primary : theme.colors.textMain);
  const sz = large ? theme.icons.large : size;
  const sizeStyle = narrow ? styles.narrow : wide ? styles.wide : undefined;

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={[styles.icon, sizeStyle, style]}
      ref={ref}
      role={onPress || onLongPress ? 'button' : undefined}
      aria-label={accessibilityLabel}
      aria-hint={accessibilityHint}
      aria-disabled={disabled}
      testID={testID}
      disabled={disabled}
      hitSlop={hitSlop}
    >
      <MaterialIcons name={icon} size={sz} color={clr} style={iconStyle} />
    </Pressable>
  );
}

export default Icon;
