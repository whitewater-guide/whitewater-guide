import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamsList, Screens } from '../../../core/navigation';

export type RegisterScreenProps = NativeStackScreenProps<
  RootStackParamsList,
  typeof Screens.AUTH_REGISTER
>;
