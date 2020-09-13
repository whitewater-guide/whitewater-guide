import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';

import { Screens } from '~/core/navigation';

import { SectionScreenNavProp, SectionTabsParamsList } from '../types';

export type SectionChartNavProp = CompositeNavigationProp<
  MaterialBottomTabNavigationProp<SectionTabsParamsList, Screens.SECTION_CHART>,
  SectionScreenNavProp
>;

export interface SectionChartNavProps {
  navigation: SectionChartNavProp;
  route: RouteProp<SectionTabsParamsList, Screens.SECTION_CHART>;
}
