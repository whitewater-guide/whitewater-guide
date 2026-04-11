import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native-paper';

function NoRegionDescription() {
  const { t } = useTranslation();
  return <Text>{t('region:info.noData')}</Text>;
}

export default NoRegionDescription;
