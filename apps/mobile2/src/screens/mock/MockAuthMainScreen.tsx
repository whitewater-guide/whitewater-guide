import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';

import { Screens } from '../../core/navigation';
import type { AuthStackParamsList } from '../../core/navigation/navigation-params';
import MockButton from './MockButton';
import MockScreenWrapper from './MockScreenWrapper';

const MockAuthMainScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamsList>>();

  return (
    <MockScreenWrapper>
      <MockButton
        label="Sign In"
        testID="auth:sign-in"
        onPress={() => navigation.navigate(Screens.AUTH_SIGN_IN)}
      />
      <MockButton
        label="Register"
        testID="auth:register"
        onPress={() => navigation.navigate(Screens.AUTH_REGISTER)}
      />
    </MockScreenWrapper>
  );
};

export default MockAuthMainScreen;
