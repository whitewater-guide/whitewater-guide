import { Screens } from '../../../core/navigation';
import AuthScreenBase from '../AuthScreenBase';
import type { RegisterScreenProps } from './navigation-types';
import RegisterForm from './RegisterForm';

export function RegisterScreen(_: RegisterScreenProps) {
  return (
    <AuthScreenBase testID={`screen:${Screens.AUTH_REGISTER}`}>
      <RegisterForm />
    </AuthScreenBase>
  );
}
