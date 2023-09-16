import type { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import type {
  CompositeNavigationProp,
  RouteProp,
} from '@react-navigation/native';

import type { Screens } from '~/core/navigation';

import type { RegionTabsNavProp, RegionTabsParamsList } from '../types';

export type RegionSectionsNavProp = CompositeNavigationProp<
  MaterialBottomTabNavigationProp<
    RegionTabsParamsList,
    Screens.REGION_SECTIONS_LIST
  >,
  RegionTabsNavProp
>;

export interface RegionSectionsNavProps {
  navigation: RegionSectionsNavProp;
  route: RouteProp<RegionTabsParamsList, Screens.REGION_SECTIONS_LIST>;
}
