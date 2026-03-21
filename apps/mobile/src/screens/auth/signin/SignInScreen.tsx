import { useAuth } from '@whitewater-guide/clients';
import React, { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Button } from 'react-native-paper';

import Divider from '~/components/Divider';
import { Screens } from '~/core/navigation';

import { AuthScreenBase } from '../AuthScreenBase';
import { SignInForm } from './SignInForm';
import type { AuthSignInNavProps } from './types';

const SignInScreen: React.FC<AuthSignInNavProps> = ({ navigation }) => {
  const { loading } = useAuth();
  const { t } = useTranslation();
  const { navigate } = navigation;
  const register = useCallback(
    () => navigate(Screens.AUTH_REGISTER),
    [navigate],
  );
  const social = useCallback(() => navigate(Screens.AUTH_SOCIAL), [navigate]);
  const keyboardScrollRef = useRef<View>(null);
  return (
    <AuthScreenBase keyboardScrollRef={keyboardScrollRef}>
      <View>
        <SignInForm />
        <View ref={keyboardScrollRef} collapsable={false} />
        <Button
          mode="text"
          onPress={social}
          disabled={loading}
          testID="auth-signin-social"
        >
          {t('screens:auth.signin.social')}
        </Button>
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
