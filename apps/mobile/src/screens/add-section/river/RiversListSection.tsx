import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Caption } from 'react-native-paper';

import theme from '~/theme';

const styles = StyleSheet.create({
  container: {
    height: (2 * theme.rowHeight) / 3,
    justifyContent: 'center',
    backgroundColor: theme.colors.primaryBackground,
  },
});

interface Props {
  id: string;
}

const RiversListSection: React.FC<Props> = ({ id }) => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Caption>{t(id)}</Caption>
    </View>
  );
};

export default RiversListSection;
