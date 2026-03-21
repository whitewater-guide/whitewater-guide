import type { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import type {
  CompositeNavigationProp,
  RouteProp,
} from '@react-navigation/native';

import type { Screens } from '~/core/navigation';

import type { SectionScreenNavProp, SectionTabsParamsList } from '../types';

export type SectionMediaNavProp = CompositeNavigationProp<
  MaterialBottomTabNavigationProp<SectionTabsParamsList, Screens.SECTION_MEDIA>,
  SectionScreenNavProp
>;

export interface SectionMediaNavProps {
  navigation: SectionMediaNavProp;
  route: RouteProp<SectionTabsParamsList, Screens.SECTION_MEDIA>;
}
