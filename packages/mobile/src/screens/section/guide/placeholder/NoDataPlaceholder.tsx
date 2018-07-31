import React from 'react';
import { withI18n, WithI18n } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Caption } from 'react-native-paper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const NoDataPlaceholder: React.SFC<WithI18n> = ({ t }) => (
  <View style={styles.container}>
    <Caption>
      {t('section:guide.noData')}
    </Caption>
  </View>
);

export default withI18n()(NoDataPlaceholder) as React.ComponentType<{}>;
