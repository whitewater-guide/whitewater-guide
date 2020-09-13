import { MaterialTopTabNavigationProp } from '@react-navigation/material-top-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';

import { Screens } from '~/core/navigation';

import { AddSectionTabsNavProp, AddSectionTabsParamsList } from '../types';

export type AddSectionFlowsNavProp = CompositeNavigationProp<
  MaterialTopTabNavigationProp<
    AddSectionTabsParamsList,
    Screens.ADD_SECTION_FLOWS
  >,
  AddSectionTabsNavProp
>;

export interface AddSectionFlowsNavProps {
  navigation: AddSectionFlowsNavProp;
  route: RouteProp<AddSectionTabsParamsList, Screens.ADD_SECTION_FLOWS>;
}
