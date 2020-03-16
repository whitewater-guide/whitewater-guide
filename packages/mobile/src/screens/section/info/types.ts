import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { Screens } from '~/core/navigation';
import { SectionScreenNavProp, SectionTabsParamsList } from '../types';

export type SectionInfoNavProp = CompositeNavigationProp<
  MaterialBottomTabNavigationProp<SectionTabsParamsList, Screens.SECTION_INFO>,
  SectionScreenNavProp
>;

export interface SectionInfoNavProps {
  navigation: SectionInfoNavProp;
  route: RouteProp<SectionTabsParamsList, Screens.SECTION_INFO>;
}
