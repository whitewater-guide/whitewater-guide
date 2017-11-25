import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '../../../components';
import I18n from '../../../i18n';

const styles = {
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default () => (
  <View style={styles.container}>
    <Text>{I18n.t('section.guide.noData')}</Text>
  </View>
);
