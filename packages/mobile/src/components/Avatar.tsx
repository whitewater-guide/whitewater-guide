import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Config from 'react-native-config';
import theme from '../theme';
import { Touchable } from './Touchable';

const AVATAR_SIZE = 48;
const AVATAR_SIZE_SMALL = 32;

const styles = StyleSheet.create({
  container: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: theme.colors.primary,
  },
  avatar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE /2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: AVATAR_SIZE / 2,
    color: theme.colors.textLight,
    backgroundColor: 'transparent',
  },
});

const stylesSmall = StyleSheet.create({
  container: {
    width: AVATAR_SIZE_SMALL,
    height: AVATAR_SIZE_SMALL,
    borderRadius: AVATAR_SIZE_SMALL / 2,
    backgroundColor: theme.colors.primary,
  },
  avatar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: AVATAR_SIZE_SMALL,
    height: AVATAR_SIZE_SMALL,
    borderRadius: AVATAR_SIZE_SMALL / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: AVATAR_SIZE_SMALL / 2,
    color: theme.colors.textLight,
    backgroundColor: 'transparent',
  },
});

interface AvatarProps {
  firstName?: string | null;
  lastName?: string | null;
  avatar?: string | null;
  small?: boolean;
  onPress?: () => void;
}

export const Avatar: React.StatelessComponent<AvatarProps> = ({ firstName, lastName, avatar, onPress, small }) => {
  const s = small ? stylesSmall : styles;
  const name = (firstName && lastName) ? `${firstName[0]}${lastName[0]}`.toUpperCase() : '?';
  const avatarSize = small ? AVATAR_SIZE_SMALL : AVATAR_SIZE;
  const uri = (avatar && avatar.startsWith('http')) ?
    avatar :
    `${Config.BACKEND_PROTOCOL}://${Config.BACKEND_HOST}/images/${avatarSize}/avatars/${avatar}`;
  const result = (
    <View style={s.container}>
      <View style={s.avatar}>
        <Text style={s.text}>
          {name}
        </Text>
      </View>
      {avatar && <Image source={{ uri }} style={s.avatar} resizeMode="contain" />}
    </View>
  );
  if (onPress) {
    return (
      <Touchable onPress={onPress}>
        {result}
      </Touchable>
    );
  }
  return result;
};
