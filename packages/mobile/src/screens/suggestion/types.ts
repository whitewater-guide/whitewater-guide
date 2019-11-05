import { SuggestionInput } from '@whitewater-guide/commons';
import { LocalPhoto } from '../../features/uploads';

export type PhotoSuggestion = Omit<
  SuggestionInput,
  'filename' | 'resolution'
> & { photo: LocalPhoto };
