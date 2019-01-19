import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Title } from 'react-native-paper';
import theme from '../theme';
import { User } from '../ww-commons';
import { Avatar } from './Avatar';

const styles = StyleSheet.create({
  icon: {
    marginRight: theme.margin.single,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.margin.single,
  },
  containerPadding: {
    padding: theme.margin.single,
  },
  fontMedium: {
    fontSize: 18,
    lineHeight: 25,
  },
});

interface Props {
  user: Pick<User, 'name' | 'avatar'>;
  medium?: boolean;
  padded?: boolean;
}

export const UserHeader: React.FC<Props> = ({ user, medium, padded = true }) => (
  <View style={[styles.container, padded && styles.containerPadding]}>
    <Avatar avatar={user.avatar} name={user.name} style={styles.icon} medium={medium} />
    <Title style={medium && styles.fontMedium}>{user.name}</Title>
  </View>
);
