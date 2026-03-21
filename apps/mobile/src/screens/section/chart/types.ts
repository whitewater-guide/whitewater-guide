import type { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import type {
  CompositeNavigationProp,
  RouteProp,
} from '@react-navigation/native';
import type { SectionDetailsFragment } from '@whitewater-guide/clients';

import type { Screens } from '~/core/navigation';

import type { SectionScreenNavProp, SectionTabsParamsList } from '../types';

export type SectionGauge = SectionDetailsFragment['gauge'];

export type SectionChartNavProp = CompositeNavigationProp<
  MaterialBottomTabNavigationProp<SectionTabsParamsList, Screens.SECTION_CHART>,
  SectionScreenNavProp
>;

export interface SectionChartNavProps {
  navigation: SectionChartNavProp;
  route: RouteProp<SectionTabsParamsList, Screens.SECTION_CHART>;
}
