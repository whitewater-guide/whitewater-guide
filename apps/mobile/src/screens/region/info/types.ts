import type { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import type {
  CompositeNavigationProp,
  RouteProp,
} from '@react-navigation/native';

import type { Screens } from '~/core/navigation';
import type {
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
