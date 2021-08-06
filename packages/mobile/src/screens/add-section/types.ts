import {
  CompositeNavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MediaInput, SectionInput } from '@whitewater-guide/schema';
import { Overwrite } from 'utility-types';

import { RootStackParamsList, Screens } from '~/core/navigation';
import { LocalPhoto } from '~/features/uploads';

import { PiToState } from './shape/usePiToState';

export type Shape = Pick<PiToState, 'shape'>;

// This does not support blogs and videos, but we don't have them in UI
export type MediaFormInput = Omit<MediaInput, 'url' | 'resolution'> & {
  photo: LocalPhoto;
};

export type SectionFormInput = Overwrite<
  SectionInput,
  { media: MediaFormInput[] }
>;

export interface AddSectionStackParamsList extends ParamListBase {
  [Screens.ADD_SECTION_TABS]: undefined;
  [Screens.ADD_SECTION_RIVER]: undefined;
  [Screens.ADD_SECTION_GAUGE]: undefined;
  [Screens.ADD_SECTION_SHAPE]: undefined;
  [Screens.ADD_SECTION_PHOTO]: {
    index: number;
    localPhotoId: string;
  };
}

export interface AddSectionTabsParamsList extends ParamListBase {
  [Screens.ADD_SECTION_MAIN]: undefined;
  [Screens.ADD_SECTION_ATTRIBUTES]: undefined;
  [Screens.ADD_SECTION_DESCRIPTION]: undefined;
  [Screens.ADD_SECTION_FLOWS]: undefined;
  [Screens.ADD_SECTION_PHOTOS]: undefined;
}

export type AddSectionNavProp = StackNavigationProp<
  RootStackParamsList,
  Screens.ADD_SECTION_SCREEN
>;

export interface AddSectionNavProps {
  navigation: AddSectionNavProp;
  route: RouteProp<RootStackParamsList, Screens.ADD_SECTION_SCREEN>;
}

export type AddSectionTabsNavProp = CompositeNavigationProp<
  StackNavigationProp<AddSectionStackParamsList, Screens.ADD_SECTION_TABS>,
  AddSectionNavProp
>;

export interface AddSectionTabsNavProps {
  navigation: AddSectionNavProp;
  route: RouteProp<AddSectionStackParamsList, Screens.ADD_SECTION_TABS>;
}
