import type { MaterialTopTabNavigationProp } from '@react-navigation/material-top-tabs';
import type {
  CompositeNavigationProp,
  RouteProp,
} from '@react-navigation/native';

import type { Screens } from '~/core/navigation';

import type { AddSectionTabsNavProp, AddSectionTabsParamsList } from '../types';

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
