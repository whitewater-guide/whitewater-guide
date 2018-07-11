import React from 'react';
import { translate } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Caption } from 'react-native-paper';
import { WithT } from '../../../../i18n';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const NoDataPlaceholder: React.SFC<WithT> = ({ t }) => (
  <View style={styles.container}>
    <Caption>
      {t('section:guide.noData')}
    </Caption>
  </View>
);

export default translate()(NoDataPlaceholder);
