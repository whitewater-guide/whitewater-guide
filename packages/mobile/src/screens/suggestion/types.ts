import type {
  CompositeNavigationProp,
  RouteProp,
} from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { SuggestionInput } from '@whitewater-guide/schema';

import type {
  RootDrawerParamsList,
  RootStackParamsList,
  Screens,
} from '~/core/navigation';
import type { LocalPhoto } from '~/features/uploads';

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
