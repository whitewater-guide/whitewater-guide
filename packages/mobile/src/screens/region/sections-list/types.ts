import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';

import { Screens } from '~/core/navigation';

import { RegionTabsNavProp, RegionTabsParamsList } from '../types';

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
