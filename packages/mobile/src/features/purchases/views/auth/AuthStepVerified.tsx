import { User } from '@whitewater-guide/commons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Paragraph, Subheading } from 'react-native-paper';

interface Props {
  me: Pick<User, 'name' | 'avatar' | 'verified'>;
}

const AuthStepVerified: React.FC<Props> = ({ me }) => {
  const { t } = useTranslation();
  return (
    <React.Fragment>
      <Subheading>
        {t('features:purchases.auth.verified.header', { name: me.name })}
      </Subheading>
      <Paragraph>{t('features:purchases.auth.verified.description')}</Paragraph>
    </React.Fragment>
  );
};

export default AuthStepVerified;
