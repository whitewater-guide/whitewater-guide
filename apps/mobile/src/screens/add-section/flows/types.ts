import type { MaterialTopTabNavigationProp } from '@react-navigation/material-top-tabs';
import type {
  CompositeNavigationProp,
  RouteProp,
} from '@react-navigation/native';

import type { Screens } from '~/core/navigation';

import type { AddSectionTabsNavProp, AddSectionTabsParamsList } from '../types';

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
