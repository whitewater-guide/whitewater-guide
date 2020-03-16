import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Screens } from '~/core/navigation';
import {
  AddSectionNavProp,
  AddSectionStackParamsList,
} from '~/screens/region/add-section/types';

export type AddSectionPhotoNavProp = CompositeNavigationProp<
  StackNavigationProp<AddSectionStackParamsList, Screens.ADD_SECTION_PHOTO>,
  AddSectionNavProp
>;

export interface AddSectionPhotoNavProps {
  navigation: AddSectionNavProp;
  route: RouteProp<AddSectionStackParamsList, Screens.ADD_SECTION_PHOTO>;
}
