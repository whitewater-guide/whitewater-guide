import { useAuth } from '@whitewater-guide/clients';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Button } from 'react-native-paper';

import Divider from '~/components/Divider';
import { Screens } from '~/core/navigation';

import { AuthScreenBase } from '../AuthScreenBase';
import { FacebookButton } from '../FacebookButton';
import { SignInForm } from './SignInForm';
import { AuthSignInNavProps } from './types';

const SignInScreen: React.FC<AuthSignInNavProps> = ({ navigation }) => {
  const { loading } = useAuth();
  const { t } = useTranslation();
  const { navigate } = navigation;
  const register = useCallback(() => navigate(Screens.AUTH_REGISTER), [
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

export default SignInScreen;
