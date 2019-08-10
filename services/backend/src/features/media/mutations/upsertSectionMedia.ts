import { isInputValidResolver, TopLevelResolver } from '@apollo';
import {
  MediaInput,
  MediaInputSchema,
  yupTypes,
} from '@whitewater-guide/commons';
import * as yup from 'yup';

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
