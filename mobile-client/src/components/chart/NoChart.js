import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Text, Icon } from 'native-base';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width,
    height: width,
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
