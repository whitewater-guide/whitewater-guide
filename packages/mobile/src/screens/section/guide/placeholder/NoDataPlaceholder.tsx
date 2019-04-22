import React from 'react';
import { useTranslation } from 'react-i18next';
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

const NoDataPlaceholder: React.FC = () => {
  const [t] = useTranslation();
  return (
    <View style={styles.container}>
      <Caption>{t('section:guide.noData')}</Caption>
    </View>
  );
};

export default NoDataPlaceholder;
