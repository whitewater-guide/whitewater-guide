import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { Screens } from '~/core/navigation';
import { RegionTabsNavProp, RegionTabsParamsList } from '../types';

export type RegionMapNavProp = CompositeNavigationProp<
  MaterialBottomTabNavigationProp<RegionTabsParamsList, Screens.REGION_MAP>,
  RegionTabsNavProp
>;

export interface RegionMapNavProps {
  navigation: RegionMapNavProp;
  route: RouteProp<RegionTabsParamsList, Screens.REGION_MAP>;
}
