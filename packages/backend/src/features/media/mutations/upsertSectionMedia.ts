import { MediaInput, MediaInputSchema } from '@whitewater-guide/commons';
import { yupTypes } from '@whitewater-guide/validation';
import * as yup from 'yup';

import { isInputValidResolver, TopLevelResolver } from '~/apollo';

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
