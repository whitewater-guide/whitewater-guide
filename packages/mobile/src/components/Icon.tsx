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
}

export const Icon: React.FC<IconProps> = (props) => {
  const { wide, narrow, style, ...rest } = props;
  let sizeStyle = {};
  if (narrow) {
    sizeStyle = styles.narrow;
  } else if (wide) {
    sizeStyle = styles.wide;
  }
  return <IconBase {...rest} style={[styles.icon, sizeStyle, style]} />;
};
