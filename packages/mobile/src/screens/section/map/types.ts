import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { Screens } from '~/core/navigation';
import { SectionScreenNavProp, SectionTabsParamsList } from '../types';

export type SectionMapNavProp = CompositeNavigationProp<
  MaterialBottomTabNavigationProp<SectionTabsParamsList, Screens.SECTION_MAP>,
  SectionScreenNavProp
>;

export interface SectionMapNavProps {
  navigation: SectionMapNavProp;
  route: RouteProp<SectionTabsParamsList, Screens.SECTION_MAP>;
}
