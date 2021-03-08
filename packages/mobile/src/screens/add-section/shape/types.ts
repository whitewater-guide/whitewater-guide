import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { Screens } from '~/core/navigation';

import { AddSectionNavProp, AddSectionStackParamsList } from '../types';

export type AddSectionShapeNavProp = CompositeNavigationProp<
  StackNavigationProp<AddSectionStackParamsList, Screens.ADD_SECTION_SHAPE>,
  AddSectionNavProp
>;

export interface AddSectionShapeNavProps {
  navigation: AddSectionNavProp;
  route: RouteProp<AddSectionStackParamsList, Screens.ADD_SECTION_SHAPE>;
}
