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
    padding: theme.margin.single,
    marginBottom: theme.margin.single,
  },
});

interface Props {
  user: Pick<User, 'name' | 'avatar'>;
}

const UserHeader: React.StatelessComponent<Props> = ({ user }) => (
  <View style={styles.container}>
    <Avatar avatar={user.avatar} name={user.name} style={styles.icon} />
    <Title>{user.name}</Title>
  </View>
);

export default UserHeader;
