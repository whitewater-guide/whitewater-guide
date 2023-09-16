import React, { useRef } from 'react';
import type { View } from 'react-native';

import { AuthScreenBase } from '../AuthScreenBase';
import { RegisterForm } from './RegisterForm';
import type { AuthRegisterNavProps } from './types';

const RegisterScreen: React.FC<AuthRegisterNavProps> = () => {
  const keyboardScrollRef = useRef<View>(null);
  return (
    <AuthScreenBase keyboardScrollRef={keyboardScrollRef}>
      <RegisterForm keyboardScrollRef={keyboardScrollRef} />
    </AuthScreenBase>
  );
};

export default RegisterScreen;
