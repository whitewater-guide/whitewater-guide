import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { Screens } from '~/core/navigation';
import { SectionScreenNavProp, SectionTabsParamsList } from '../types';

export type SectionGuideNavProp = CompositeNavigationProp<
  MaterialBottomTabNavigationProp<SectionTabsParamsList, Screens.SECTION_GUIDE>,
  SectionScreenNavProp
>;

export interface SectionGuideNavProps {
  navigation: SectionGuideNavProp;
  route: RouteProp<SectionTabsParamsList, Screens.SECTION_GUIDE>;
}
