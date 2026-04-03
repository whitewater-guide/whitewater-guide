import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function NoSectionsPlaceholder() {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Text variant="titleMedium">{t('region:sections.empty.title')}</Text>
      <Text variant="bodyMedium">{t('region:sections.empty.body')}</Text>
    </View>
  );
}

export default NoSectionsPlaceholder;
