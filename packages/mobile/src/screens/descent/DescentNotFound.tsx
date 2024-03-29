import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Paragraph } from 'react-native-paper';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const DescentNotFound: React.FC = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Paragraph>{t('screens:descent.notFound')}</Paragraph>
    </View>
  );
};

export default DescentNotFound;
