import glamorous, { GlamorousComponent } from 'glamorous-native';
import React from 'react';
import {
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import MDCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import theme from '../theme';

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
  },
});

interface IconBaseProps {
  icon: string;
  primary?: boolean;
  color?: string;
  onPress?: (event: GestureResponderEvent) => void;
  onLongPress?: (event: GestureResponderEvent) => void;
  size?: number;
  large?: boolean;
  style?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ViewStyle>;
}

const IconBase: React.StatelessComponent<IconBaseProps> = (props) => {
  const {
    icon,
    color,
    primary,
    size = theme.icons.regular,
    large,
    onPress,
    onLongPress,
    style,
    iconStyle,
  } = props;
  const clr = color
    ? color
    : primary
    ? theme.colors.primary
    : theme.colors.textMain;
  const sz = large ? theme.icons.large : size;
  if (onPress || onLongPress) {
    return (
      <TouchableRipple
        onPress={onPress}
        onLongPress={onLongPress}
        style={style}
      >
        <MDCommunity name={icon} size={sz} color={clr} style={iconStyle} />
      </TouchableRipple>
    );
  }
  return (
    <View style={style}>
      <MDCommunity name={icon} size={sz} color={clr} style={iconStyle} />
    </View>
  );
};

export interface IconProps extends IconBaseProps {
  wide?: boolean;
  narrow?: boolean;
  width?: number;
  height?: number;
}

const iconFactory = glamorous<IconProps>(IconBase, { displayName: 'Icon' });

export const Icon: GlamorousComponent<IconProps, ViewStyle> = iconFactory(
  styles.button,
  ({ narrow, wide, width, height }: IconProps) => {
    if (narrow) {
      return { width: undefined, height: undefined };
    } else if (wide) {
      return { width: 45, height: 45 };
    } else if (width !== undefined || height !== undefined) {
      return { width, height };
    }
    return null;
  },
);
