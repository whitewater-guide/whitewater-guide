import * as yup from 'yup';

import { MediaInput, MediaInputSchema } from '@whitewater-guide/commons';
import { TopLevelResolver, isInputValidResolver } from '@apollo';

import { yupTypes } from '@whitewater-guide/validation';

interface Vars {
  sectionId: string;
  media: MediaInput;
}

const Struct = yup.object({
  sectionId: yupTypes.uuid(),
  media: MediaInputSchema,
});

const resolver: TopLevelResolver<Vars> = async (
  _,
  { media, sectionId },
  { dataSources },
) => {
  await dataSources.users.assertEditorPermissions({ sectionId });
  return dataSources.media.upsertSectionMedia(media, sectionId);
};

const upsertSectionMedia = isInputValidResolver(Struct, resolver);

export default upsertSectionMedia;
