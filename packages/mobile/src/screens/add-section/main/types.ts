import { MaterialTopTabNavigationProp } from '@react-navigation/material-top-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';

import { Screens } from '~/core/navigation';

import { AddSectionTabsNavProp, AddSectionTabsParamsList } from '../types';

export type AddSectionMainNavProp = CompositeNavigationProp<
  MaterialTopTabNavigationProp<
    AddSectionTabsParamsList,
    Screens.ADD_SECTION_MAIN
  >,
  AddSectionTabsNavProp
>;

export interface AddSectionMainNavProps {
  navigation: AddSectionMainNavProp;
  route: RouteProp<AddSectionTabsParamsList, Screens.ADD_SECTION_MAIN>;
}
