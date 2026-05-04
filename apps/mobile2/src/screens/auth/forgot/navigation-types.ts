import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamsList, Screens } from '../../../core/navigation';

export type ForgotScreenProps = NativeStackScreenProps<
  RootStackParamsList,
  typeof Screens.AUTH_FORGOT
>;
