import { MediaInput, Overwrite, SectionInput } from '@whitewater-guide/commons';
import { LocalPhoto } from '../../../features/uploads';
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
