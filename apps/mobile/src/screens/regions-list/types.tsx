import type {
  CompositeNavigationProp,
  RouteProp,
} from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import type {
  RootDrawerParamsList,
  RootStackParamsList,
  Screens,
} from '~/core/navigation';

export type RegionsListNavProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamsList, Screens.REGIONS_LIST>,
  StackNavigationProp<RootDrawerParamsList>
>;

export interface RegionsListNavProps {
  navigation: RegionsListNavProp;
  route: RouteProp<RootStackParamsList, Screens.REGIONS_LIST>;
}
