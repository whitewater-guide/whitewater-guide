import type {
  CompositeNavigationProp,
  RouteProp,
} from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import type { Screens } from '~/core/navigation';

import type { AddSectionNavProp, AddSectionStackParamsList } from '../types';

export type AddSectionShapeNavProp = CompositeNavigationProp<
  StackNavigationProp<AddSectionStackParamsList, Screens.ADD_SECTION_SHAPE>,
  AddSectionNavProp
>;

export interface AddSectionShapeNavProps {
  navigation: AddSectionNavProp;
  route: RouteProp<AddSectionStackParamsList, Screens.ADD_SECTION_SHAPE>;
}
