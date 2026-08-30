import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export interface IconProps {
  icon: IconName;
  color?: string;
  size?: number;
  narrow?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<TextStyle>;
}

export function Icon({
  icon,
  color,
  size = 24,
  narrow,
  onPress,
  accessibilityLabel,
  style,
  iconStyle,
}: IconProps) {
  const theme = useTheme();
  const tint = color ?? theme.text;
  const sizeStyle = narrow ? styles.narrow : undefined;

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={[styles.icon, sizeStyle, style]}
        role="button"
        accessibilityLabel={accessibilityLabel}
      >
        <MaterialCommunityIcons
          name={icon}
          size={size}
          color={tint}
          style={iconStyle}
        />
      </Pressable>
    );
  }

  return (
    <View
      style={[styles.icon, sizeStyle, style]}
      accessibilityLabel={accessibilityLabel}
    >
      <MaterialCommunityIcons
        name={icon}
        size={size}
        color={tint}
        style={iconStyle}
      />
    </View>
  );
}

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
});
