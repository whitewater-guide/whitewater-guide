import type { MaterialTopTabNavigationProp } from '@react-navigation/material-top-tabs';
import type {
  CompositeNavigationProp,
  RouteProp,
} from '@react-navigation/native';

import type { Screens } from '~/core/navigation';

import type { AddSectionTabsNavProp, AddSectionTabsParamsList } from '../types';

export type AddSectionPhotosNavProp = CompositeNavigationProp<
  MaterialTopTabNavigationProp<
    AddSectionTabsParamsList,
    Screens.ADD_SECTION_PHOTOS
  >,
  AddSectionTabsNavProp
>;

export interface AddSectionPhotosNavProps {
  navigation: AddSectionPhotosNavProp;
  route: RouteProp<AddSectionTabsParamsList, Screens.ADD_SECTION_PHOTOS>;
}
