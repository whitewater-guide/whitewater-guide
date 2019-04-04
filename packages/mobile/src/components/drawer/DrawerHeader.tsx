import { useAuth } from '@whitewater-guide/clients';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import theme from '../../theme';
import { AnonHeader } from '../AnonHeader';
import { Loading } from '../Loading';
import { UserHeader } from '../UserHeader';

const styles = StyleSheet.create({
  container: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.margin.single,
    marginBottom: theme.margin.single,
  },
});

const DrawerHeader: React.FC = () => {
  const { me, loading } = useAuth();
  if (loading) {
    return (
      <View style={styles.container}>
        <Loading />
      </View>
    );
  }
  return !!me ? <UserHeader user={me} /> : <AnonHeader />;
};

export default DrawerHeader;
