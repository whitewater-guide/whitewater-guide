import type {
  CompositeNavigationProp,
  RouteProp,
} from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import type { Screens } from '~/core/navigation';
import type {
  AddSectionNavProp,
  AddSectionStackParamsList,
} from '~/screens/add-section/types';

export type AddSectionPhotoNavProp = CompositeNavigationProp<
  StackNavigationProp<AddSectionStackParamsList, Screens.ADD_SECTION_PHOTO>,
  AddSectionNavProp
>;

export interface AddSectionPhotoNavProps {
  navigation: AddSectionNavProp;
  route: RouteProp<AddSectionStackParamsList, Screens.ADD_SECTION_PHOTO>;
}
