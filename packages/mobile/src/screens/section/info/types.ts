import type { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import type {
  CompositeNavigationProp,
  RouteProp,
} from '@react-navigation/native';

import type { Screens } from '~/core/navigation';

import type { SectionScreenNavProp, SectionTabsParamsList } from '../types';

export type SectionInfoNavProp = CompositeNavigationProp<
  MaterialBottomTabNavigationProp<SectionTabsParamsList, Screens.SECTION_INFO>,
  SectionScreenNavProp
>;

export interface SectionInfoNavProps {
  navigation: SectionInfoNavProp;
  route: RouteProp<SectionTabsParamsList, Screens.SECTION_INFO>;
}
