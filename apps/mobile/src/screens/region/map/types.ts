import type { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import type {
  CompositeNavigationProp,
  RouteProp,
} from '@react-navigation/native';

import type { Screens } from '~/core/navigation';

import type { RegionTabsNavProp, RegionTabsParamsList } from '../types';

export type RegionMapNavProp = CompositeNavigationProp<
  MaterialBottomTabNavigationProp<RegionTabsParamsList, Screens.REGION_MAP>,
  RegionTabsNavProp
>;

export interface RegionMapNavProps {
  navigation: RegionMapNavProp;
  route: RouteProp<RegionTabsParamsList, Screens.REGION_MAP>;
}
