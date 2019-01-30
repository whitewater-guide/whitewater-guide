import React from 'react';
import { StyleSheet, View } from 'react-native';
import theme from '../../theme';
import { WithMe } from '@whitewater-guide/clients';
import { AnonHeader } from '../AnonHeader';
import { Loading } from '../Loading';
import { UserHeader } from '../UserHeader';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.margin.single,
    marginBottom: theme.margin.single,
  },
});

const DrawerHeader: React.SFC<WithMe> = ({ me, meLoading }) => {
  if (meLoading) {
    return (
      <View style={styles.container}>
        <Loading />
      </View>
    );
  }
  return !!me ? <UserHeader user={me} /> : <AnonHeader />;
};

export default DrawerHeader;
