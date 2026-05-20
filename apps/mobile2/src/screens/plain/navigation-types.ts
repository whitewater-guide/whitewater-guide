import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamsList, Screens } from '../../core/navigation';

export type PlainTextScreenProps = NativeStackScreenProps<
  RootStackParamsList,
  typeof Screens.PLAIN
>;
