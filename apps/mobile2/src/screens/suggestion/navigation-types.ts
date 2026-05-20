import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SuggestionInput } from '@whitewater-guide/schema';

import type { RootStackParamsList, Screens } from '../../core/navigation';
import type { LocalPhoto } from '../../features/uploads';

export type PhotoSuggestion = Omit<
  SuggestionInput,
  'filename' | 'resolution'
> & {
  photo: LocalPhoto;
};

export type SuggestionScreenProps = NativeStackScreenProps<
  RootStackParamsList,
  typeof Screens.SUGGESTION
>;
