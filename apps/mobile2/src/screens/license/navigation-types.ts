import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamsList, Screens } from '../../core/navigation';

export type LicenseScreenProps = NativeStackScreenProps<
  RootStackParamsList,
  typeof Screens.LICENSE
>;
