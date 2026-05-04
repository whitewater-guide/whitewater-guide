import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamsList, Screens } from '../../../core/navigation';

export type SignInScreenProps = NativeStackScreenProps<
  RootStackParamsList,
  typeof Screens.AUTH_SIGN_IN
>;
