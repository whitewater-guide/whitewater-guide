import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '@whitewater-guide/clients';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Button } from 'react-native-paper';

import type { RootStackParamsList } from '../../../core/navigation';
import { Screens } from '../../../core/navigation';
import AuthScreenBase from '../AuthScreenBase';
import SignInForm from './SignInForm';

type Props = NativeStackScreenProps<
  RootStackParamsList,
  typeof Screens.AUTH_SIGN_IN
>;

export function SignInScreen({ navigation }: Props) {
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
