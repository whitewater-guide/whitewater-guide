import { MaterialTopTabNavigationProp } from '@react-navigation/material-top-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { Screens } from '~/core/navigation';
import { AddSectionTabsNavProp, AddSectionTabsParamsList } from '../types';

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
