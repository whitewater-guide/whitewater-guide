import { WithMe } from '@whitewater-guide/clients';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { RootState } from '../../core/reducers';
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

interface ConnectProps {
  isLoggingIn: boolean;
}

const DrawerHeader: React.FC<WithMe & ConnectProps> = ({
  me,
  meLoading,
  isLoggingIn,
}) => {
  if (meLoading || isLoggingIn) {
    return (
      <View style={styles.container}>
        <Loading />
      </View>
    );
  }
  return !!me ? <UserHeader user={me} /> : <AnonHeader />;
};

export default connect((state: RootState) => ({
  isLoggingIn: state.auth.isLoggingIn,
}))(DrawerHeader);
