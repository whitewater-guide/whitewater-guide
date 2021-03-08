import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';

import { Screens } from '~/core/navigation';
import {
  RegionTabsNavProp,
  RegionTabsParamsList,
} from '~/screens/region/types';

export type RegionInfoNavProp = CompositeNavigationProp<
  MaterialBottomTabNavigationProp<RegionTabsParamsList, Screens.REGION_INFO>,
  RegionTabsNavProp
>;

export interface RegionInfoNavProps {
  navigation: RegionInfoNavProp;
  route: RouteProp<RegionTabsParamsList, Screens.REGION_INFO>;
}
