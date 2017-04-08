import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Icon } from 'native-base';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default () => (
  <View style={styles.container}>
    <Icon name="warning" />
    <Text>There is no gauge for this section</Text>
  </View>
);
