import glamorous, { GlamorousComponent } from 'glamorous-native';
import React from 'react';
import { GestureResponderEvent, Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import IonIcon from 'react-native-vector-icons/Ionicons';
import theme from '../theme';
import { Touchable } from './Touchable';

const prefix = Platform.OS === 'ios' ? 'ios' : 'md';

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
  } = props;
  const clr = color ? color : (primary ? theme.colors.primary : theme.colors.textMain);
  const sz = large ? theme.icons.large : size;
  let IconComponent = IonIcon;
  let name = icon;
  if (icon.indexOf('fa-') === 0) {
    name = icon.substr(3);
    IconComponent = FontAwesome;
  } else if (icon.indexOf('md-') !== 0 && icon.indexOf('ios-') !== 0) {
    name = `${prefix}-${icon}`;
  }
  if (onPress || onLongPress) {
    return (
      <Touchable onPress={onPress} onLongPress={onLongPress} style={style}>
        <IconComponent name={name} size={sz} color={clr} />
      </Touchable>
    );
  }
  return (
    <View style={style}>
      <IconComponent name={name} size={sz} color={clr} />
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
