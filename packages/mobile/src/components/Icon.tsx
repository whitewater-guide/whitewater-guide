import React from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
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
  onPress?: () => void;
  onLongPress?: () => void;
  size?: number;
  large?: boolean;
  style?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<TextStyle>;
  accessibilityHint?: string;
  accessibilityLabel?: string;
  testID?: string;
}

const IconBase = React.forwardRef<any, IconBaseProps>((props, ref) => {
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
    accessibilityHint,
    accessibilityLabel,
    testID,
  } = props;
  const clr = color || (primary ? theme.colors.primary : theme.colors.textMain);
  const sz = large ? theme.icons.large : size;

  if (onPress || onLongPress) {
    return (
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        style={style}
        ref={ref}
        accessibilityHint={accessibilityHint}
        accessibilityLabel={accessibilityLabel}
        testID={testID}
      >
        <MDCommunity name={icon} size={sz} color={clr} style={iconStyle} />
      </Pressable>
    );
  }
  return (
    <View
      style={style}
      ref={ref}
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
    >
      <MDCommunity name={icon} size={sz} color={clr} style={iconStyle} />
    </View>
  );
});

IconBase.displayName = 'IconBase';

interface IconProps extends IconBaseProps {
  wide?: boolean;
  narrow?: boolean;
}

const Icon = React.forwardRef<any, IconProps>((props, ref) => {
  const { wide, narrow, style, ...rest } = props;
  let sizeStyle = {};
  if (narrow) {
    sizeStyle = styles.narrow;
  } else if (wide) {
    sizeStyle = styles.wide;
  }
  return (
    <IconBase ref={ref} {...rest} style={[styles.icon, sizeStyle, style]} />
  );
});

Icon.displayName = 'Icon';

export default Icon;
