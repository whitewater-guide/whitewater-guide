import { CommonActions, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';

import { useAuth } from '../../core/auth';
import type { AuthStackParamsList } from '../../core/navigation';
import { Screens } from '../../core/navigation';
import MockButton from './MockButton';
import MockScreenWrapper from './MockScreenWrapper';

const MockAuthSignInScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamsList>>();
  const { service } = useAuth();

  return (
    <MockScreenWrapper>
      <MockButton
        label="Submit Sign In"
        testID="auth:submit-sign-in"
        onPress={async () => {
          await service.signIn('local', {
            email: 'mock@test.com',
            password: 'mock',
          });
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: Screens.REGIONS_LIST }],
            }),
          );
        }}
      />
      <MockButton
        label="Forgot Password"
        testID="auth:forgot"
        onPress={() => navigation.navigate(Screens.AUTH_FORGOT)}
      />
    </MockScreenWrapper>
  );
};

export default MockAuthSignInScreen;
