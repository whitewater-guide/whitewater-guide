/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { RootStackNav, RootStackParamsList, Screens } from '~/core/navigation';

export type RegionScreenNavProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamsList, Screens.REGION_STACK>,
  RootStackNav
>;

export interface RegionScreenNavProps {
  navigation: RegionScreenNavProp;
  route: RouteProp<RootStackParamsList, Screens.REGION_STACK>;
}

export type RegionStackParamsList = {
  [Screens.REGION_TABS]: undefined;
  [Screens.FILTER]: undefined;
};

/**
 * regionId is not necessary for the app to work
 * it's here because passing it via [initialParams](https://reactnavigation.org/docs/screen#initialparams)
 * seems to be simplest way to track screen params in sentry
 */
export type RegionTabsParamsList = {
  [Screens.REGION_MAP]: { regionId?: string } | undefined;
  [Screens.REGION_SECTIONS_LIST]: { regionId?: string } | undefined;
  [Screens.REGION_INFO]: { regionId?: string } | undefined;
  [Screens.REGION_FAKE_CHAT]: undefined;
};

export type RegionTabsNavProp = CompositeNavigationProp<
  StackNavigationProp<RegionStackParamsList, Screens.REGION_TABS>,
  RegionScreenNavProp
>;

export interface RegionTabsNavProps {
  navigation: RegionTabsNavProp;
  route: RouteProp<RegionStackParamsList, Screens.REGION_TABS>;
}
