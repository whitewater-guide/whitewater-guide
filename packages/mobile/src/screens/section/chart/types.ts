import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { SectionDetailsFragment } from '@whitewater-guide/clients';

import { Screens } from '~/core/navigation';

import { SectionScreenNavProp, SectionTabsParamsList } from '../types';

export type SectionGauge = SectionDetailsFragment['gauge'];

export type SectionChartNavProp = CompositeNavigationProp<
  MaterialBottomTabNavigationProp<SectionTabsParamsList, Screens.SECTION_CHART>,
  SectionScreenNavProp
>;

export interface SectionChartNavProps {
  navigation: SectionChartNavProp;
  route: RouteProp<SectionTabsParamsList, Screens.SECTION_CHART>;
}
