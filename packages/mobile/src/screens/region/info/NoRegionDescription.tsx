import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Caption } from 'react-native-paper';
import { I18nText } from '../../../i18n';
import theme from '../../../theme';

const styles = StyleSheet.create({
  container: {
    width: theme.screenWidth,
    height: theme.screenWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default () => (
  <View style={styles.container}>
    <Caption>
      <I18nText>region:info.noData</I18nText>
    </Caption>
  </View>
);
