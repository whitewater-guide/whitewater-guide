import type { MediaInput, SectionInput } from '@whitewater-guide/schema';
import type { Overwrite } from 'utility-types';

import type { LocalPhoto } from '../../features/uploads';

export type MediaFormInput = Omit<MediaInput, 'url' | 'resolution'> & {
  photo: LocalPhoto;
};

export type SectionFormInput = Overwrite<
  SectionInput,
  { media: MediaFormInput[] }
>;
