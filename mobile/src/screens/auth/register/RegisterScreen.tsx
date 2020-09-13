import React from 'react';

import { AuthScreenBase } from '../AuthScreenBase';
import { RegisterForm } from './RegisterForm';
import { AuthRegisterNavProps } from './types';

const RegisterScreen: React.FC<AuthRegisterNavProps> = () => (
  <AuthScreenBase>
    <RegisterForm />
  </AuthScreenBase>
);

export default RegisterScreen;
