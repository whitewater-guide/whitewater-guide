import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamsList, Screens } from '../../core/navigation';

export type RegionsListScreenProps = NativeStackScreenProps<
  RootStackParamsList,
  typeof Screens.REGIONS_LIST
>;
