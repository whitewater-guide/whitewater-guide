import { useAuth } from '@whitewater-guide/clients';
import Divider from 'components/Divider';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from 'react-navigation-hooks';
import Screens from '../../screen-names';
import { AuthScreenBase } from '../AuthScreenBase';
import { FacebookButton } from '../FacebookButton';
import { SignInForm } from './SignInForm';

export const SignInView: React.FC = () => {
  const { loading } = useAuth();
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const register = useCallback(() => navigate(Screens.Auth.Register), [
    navigate,
  ]);
  return (
    <AuthScreenBase>
      <View>
        <SignInForm />
        <FacebookButton label={t('screens:auth.signin.facebook')} />
      </View>
      <View>
        <Divider label={t('screens:auth.signin.noAccount')} />
        <Button mode="text" onPress={register} disabled={loading}>
          {t('screens:auth.signin.register')}
        </Button>
      </View>
    </AuthScreenBase>
  );
};
