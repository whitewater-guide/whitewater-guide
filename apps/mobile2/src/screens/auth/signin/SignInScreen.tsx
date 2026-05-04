import { useAuth } from '@whitewater-guide/clients';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Button } from 'react-native-paper';

import { Screens } from '../../../core/navigation';
import AuthScreenBase from '../AuthScreenBase';
import type { SignInScreenProps } from './navigation-types';
import SignInForm from './SignInForm';

export function SignInScreen({ navigation }: SignInScreenProps) {
  const { loading } = useAuth();
  const { t } = useTranslation();
  const { navigate } = navigation;
  const register = useCallback(
    () => navigate(Screens.AUTH_REGISTER),
    [navigate],
  );

  return (
    <AuthScreenBase testID={`screen:${Screens.AUTH_SIGN_IN}`}>
      <View>
        <SignInForm />
      </View>
      <View>
        <Button mode="text" onPress={register} disabled={loading}>
          {t('screens:auth.signin.register')}
        </Button>
      </View>
    </AuthScreenBase>
  );
}
