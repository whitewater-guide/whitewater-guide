import { Screens } from '../../../core/navigation';
import AuthScreenBase from '../AuthScreenBase';
import RegisterForm from './RegisterForm';

export function RegisterScreen() {
  return (
    <AuthScreenBase testID={`screen:${Screens.AUTH_REGISTER}`}>
      <RegisterForm />
    </AuthScreenBase>
  );
}
