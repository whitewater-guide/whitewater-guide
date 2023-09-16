import type { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import type {
  CompositeNavigationProp,
  RouteProp,
} from '@react-navigation/native';

import type { Screens } from '~/core/navigation';

import type { SectionScreenNavProp, SectionTabsParamsList } from '../types';

export type SectionMapNavProp = CompositeNavigationProp<
  MaterialBottomTabNavigationProp<SectionTabsParamsList, Screens.SECTION_MAP>,
  SectionScreenNavProp
>;

export interface SectionMapNavProps {
  navigation: SectionMapNavProp;
  route: RouteProp<SectionTabsParamsList, Screens.SECTION_MAP>;
}
