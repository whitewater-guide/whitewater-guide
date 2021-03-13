import React from 'react';
import { useTranslation } from 'react-i18next';
import { Paragraph } from 'react-native-paper';

const NoDataPlaceholder: React.FC = () => {
  const { t } = useTranslation();
  return <Paragraph>{t('section:guide.noData')}</Paragraph>;
};

export default NoDataPlaceholder;
