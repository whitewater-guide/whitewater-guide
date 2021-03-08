import React from 'react';
import { useTranslation } from 'react-i18next';
import { Paragraph, Title } from 'react-native-paper';

import { AuthScreenBase } from '~/screens/auth/AuthScreenBase';
import { ForgotForm } from '~/screens/auth/forgot/ForgotForm';

import { AuthForgotNavProps } from './types';

const ForgotScreen: React.FC<AuthForgotNavProps> = () => {
  const { t } = useTranslation();
  return (
    <AuthScreenBase>
      <Title>{t('screens:auth.forgot.title')}</Title>
      <Paragraph>{t('screens:auth.forgot.description')}</Paragraph>
      <ForgotForm />
    </AuthScreenBase>
  );
};

export default ForgotScreen;
