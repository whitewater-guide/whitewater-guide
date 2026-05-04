import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamsList, Screens } from '../../core/navigation';

export type MyProfileScreenProps = NativeStackScreenProps<
  RootStackParamsList,
  typeof Screens.MY_PROFILE
>;
