import React from 'react';
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import theme from '../theme';
import { BACKEND_URL } from '../utils/urls';

const AVATAR_SIZE = 48;
const AVATAR_SIZE_MEDIUM = 40;
const AVATAR_SIZE_SMALL = 32;

const getStyles = (size: number): StyleSheet.NamedStyles<any> => ({
  container: {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: theme.colors.primary,
  },
  avatar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: size,
    height: size,
    borderRadius: size / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: size / 2,
    color: theme.colors.textLight,
    backgroundColor: 'transparent',
  },
});

const styles: any = StyleSheet.create(getStyles(AVATAR_SIZE));
const stylesSmall: any = StyleSheet.create(getStyles(AVATAR_SIZE_SMALL));
const stylesMedium: any = StyleSheet.create(getStyles(AVATAR_SIZE_SMALL));

interface AvatarProps {
  name?: string | null;
  avatar?: string | null;
  small?: boolean;
  medium?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const Avatar: React.FC<AvatarProps> = (props) => {
  const { name, avatar, onPress, small, medium, style } = props;
  const s = small ? stylesSmall : medium ? stylesMedium : styles;
  const initials = (name || '?')
    .split(' ')
    .map((str) => str[0])
    .join(' ');
  const avatarSize = small
    ? AVATAR_SIZE_SMALL
    : medium
    ? AVATAR_SIZE_MEDIUM
    : AVATAR_SIZE;
  const uri =
    avatar && avatar.startsWith('http')
      ? avatar
      : `${BACKEND_URL}/images/${avatarSize}/avatars/${avatar}`;
  const result = (
    <View style={[s.container, style]}>
      <View style={s.avatar}>
        <Text style={s.text}>{initials}</Text>
      </View>
      {!!avatar && (
        <Image source={{ uri }} style={s.avatar} resizeMode="contain" />
      )}
    </View>
  );
  if (onPress) {
    return <TouchableRipple onPress={onPress}>{result}</TouchableRipple>;
  }
  return result;
};
