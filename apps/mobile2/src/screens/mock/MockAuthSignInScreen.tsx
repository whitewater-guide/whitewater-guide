import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';

import { Screens } from '../../core/navigation';
import type { AuthStackParamsList } from '../../core/navigation/navigation-params';
import MockButton from './MockButton';
import MockScreenWrapper from './MockScreenWrapper';

const MockAuthSignInScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamsList>>();

  return (
    <MockScreenWrapper>
      <MockButton
        label="Forgot Password"
        testID="auth:forgot"
        onPress={() => navigation.navigate(Screens.AUTH_FORGOT)}
      />
    </MockScreenWrapper>
  );
};

export default MockAuthSignInScreen;
