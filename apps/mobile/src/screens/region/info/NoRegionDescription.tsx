import React from 'react';
import { useTranslation } from 'react-i18next';
import { Paragraph } from 'react-native-paper';

const NoRegionDescription: React.FC = () => {
  const { t } = useTranslation();
  return <Paragraph>{t('region:info.noData')}</Paragraph>;
};

export default NoRegionDescription;
