import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Paragraph } from 'react-native-paper';
import theme from '~/theme';

const styles = StyleSheet.create({
  container: {
    height: theme.stackScreenHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const LogbookEmpty: React.FC = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Paragraph>{t('screens:logbook.empty')}</Paragraph>
    </View>
  );
};

export default LogbookEmpty;
