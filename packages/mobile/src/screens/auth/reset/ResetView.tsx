import React from 'react';
import { useTranslation } from 'react-i18next';
import { Paragraph, Title } from 'react-native-paper';
import { AuthScreenBase } from '../AuthScreenBase';
import MissingParams from './MissingParams';
import { ResetForm } from './ResetForm';
import { ResetParams } from './types';

export const ResetView: React.FC<ResetParams> = ({ id, token }) => {
  const { t } = useTranslation();
  return (
    <AuthScreenBase>
      <Title>{t('screens:auth.reset.title')}</Title>
      <Paragraph>{t('screens:auth.reset.description')}</Paragraph>
      {!!id && !!token ? (
        <ResetForm id={id} token={token} />
      ) : (
        <MissingParams />
      )}
    </AuthScreenBase>
  );
};
