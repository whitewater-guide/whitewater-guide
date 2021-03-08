import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';

import { Screens } from '~/core/navigation';

import { SectionScreenNavProp, SectionTabsParamsList } from '../types';

export type SectionMediaNavProp = CompositeNavigationProp<
  MaterialBottomTabNavigationProp<SectionTabsParamsList, Screens.SECTION_MEDIA>,
  SectionScreenNavProp
>;

export interface SectionMediaNavProps {
  navigation: SectionMediaNavProp;
  route: RouteProp<SectionTabsParamsList, Screens.SECTION_MEDIA>;
}
