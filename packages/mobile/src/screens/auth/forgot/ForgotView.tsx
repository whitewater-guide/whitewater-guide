import React from 'react';
import { useTranslation } from 'react-i18next';
import { Paragraph, Title } from 'react-native-paper';
import { AuthScreenBase } from '../AuthScreenBase';
import { ForgotForm } from './ForgotForm';

export const ForgotView: React.FC = () => {
  const { t } = useTranslation();
  return (
    <AuthScreenBase>
      <Title>{t('screens:auth.forgot.title')}</Title>
      <Paragraph>{t('screens:auth.forgot.description')}</Paragraph>
      <ForgotForm />
    </AuthScreenBase>
  );
};
