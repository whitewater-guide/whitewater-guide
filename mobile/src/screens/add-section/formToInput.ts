import { MediaInput, SectionInput } from '@whitewater-guide/commons';

import { MediaFormInput, SectionFormInput } from './types';

function convertMedia(form: MediaFormInput): MediaInput {
  const { photo, ...rest } = form;
  return {
    ...rest,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    url: photo.url!,
    resolution: photo.resolution,
  };
}

export default function formToInput(form: SectionFormInput): SectionInput {
  const { media, ...rest } = form;
  return {
    ...rest,
    media: media.map(convertMedia),
  };
}
