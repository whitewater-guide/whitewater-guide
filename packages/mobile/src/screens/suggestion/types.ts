import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SuggestionInput } from '@whitewater-guide/commons';

import {
  RootDrawerParamsList,
  RootStackParamsList,
  Screens,
} from '~/core/navigation';
import { LocalPhoto } from '~/features/uploads';

export type PhotoSuggestion = Omit<
  SuggestionInput,
  'filename' | 'resolution'
> & { photo: LocalPhoto };

export type SuggestionNavProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamsList, Screens.SUGGESTION>,
  StackNavigationProp<RootDrawerParamsList>
>;

export interface SuggestionNavProps {
  navigation: SuggestionNavProp;
  route: RouteProp<RootStackParamsList, Screens.SUGGESTION>;
}
