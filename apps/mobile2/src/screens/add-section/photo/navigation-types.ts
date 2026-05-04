import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamsList, Screens } from '../../../core/navigation';

export type PhotoScreenProps = NativeStackScreenProps<
  RootStackParamsList,
  typeof Screens.ADD_SECTION_PHOTO
>;
