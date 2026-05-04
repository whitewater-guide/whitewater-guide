import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamsList, Screens } from '../../core/navigation';

export type DescentScreenProps = NativeStackScreenProps<
  RootStackParamsList,
  typeof Screens.DESCENT
>;
