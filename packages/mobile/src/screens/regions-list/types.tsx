import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import {
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
