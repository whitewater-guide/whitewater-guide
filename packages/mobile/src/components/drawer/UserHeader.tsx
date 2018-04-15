import React from 'react';
import { StyleSheet, View } from 'react-native';
import theme from '../../theme';
import { User } from '../../ww-commons';
import { Avatar } from '../Avatar';
import { Text } from '../Text';

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
  user: User;
}

const UserHeader: React.StatelessComponent<Props> = ({ user }) => (
  <View style={styles.container}>
    <Avatar avatar={user.avatar} name={user.name} style={styles.icon} />
    <Text large>{user.name}</Text>
  </View>
);

export default UserHeader;
