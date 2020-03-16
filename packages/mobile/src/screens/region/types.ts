import {
  CompositeNavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  RootDrawerParamsList,
  RootStackParamsList,
  Screens,
} from '~/core/navigation';

export type RegionScreenNavProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamsList, Screens.REGION_STACK>,
  StackNavigationProp<RootDrawerParamsList>
>;

export interface RegionScreenNavProps {
  navigation: RegionScreenNavProp;
  route: RouteProp<RootStackParamsList, Screens.REGION_STACK>;
}

export interface RegionStackParamsList extends ParamListBase {
  [Screens.REGION_TABS]: undefined;
  [Screens.ADD_SECTION_SCREEN]: undefined;
  [Screens.FILTER]: undefined;
}

export interface RegionTabsParamsList extends ParamListBase {
  [Screens.REGION_MAP]: undefined;
  [Screens.REGION_SECTIONS_LIST]: undefined;
  [Screens.REGION_INFO]: undefined;
}

export type RegionTabsNavProp = CompositeNavigationProp<
  StackNavigationProp<RegionStackParamsList, Screens.REGION_TABS>,
  RegionScreenNavProp
>;

export interface RegionTabsNavProps {
  navigation: RegionTabsNavProp;
  route: RouteProp<RegionStackParamsList, Screens.REGION_TABS>;
}
