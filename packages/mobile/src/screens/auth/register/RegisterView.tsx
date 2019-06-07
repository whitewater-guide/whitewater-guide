import React from 'react';
import { AuthScreenBase } from '../AuthScreenBase';
import { RegisterForm } from './RegisterForm';

export const RegisterView: React.FC = () => {
  return (
    <AuthScreenBase>
      <RegisterForm />
    </AuthScreenBase>
  );
};
