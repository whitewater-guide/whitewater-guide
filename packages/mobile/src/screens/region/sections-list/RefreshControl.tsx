import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { RefreshHeader } from 'react-native-spring-scrollview';

import theme from '~/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});

export default class RefreshControl extends RefreshHeader {
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={theme.colors.primary} size="large" />
      </View>
    );
  }
}
