import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { Screens } from '../../../core/navigation';
import type {
  RegionScreenProps,
  RegionStackParamsList,
} from '../navigation-types';

export type FilterScreenProps = CompositeScreenProps<
  NativeStackScreenProps<RegionStackParamsList, typeof Screens.FILTER>,
  RegionScreenProps
>;
