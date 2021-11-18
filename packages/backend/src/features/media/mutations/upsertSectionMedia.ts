import {
  MediaInputSchema,
  MutationUpsertSectionMediaArgs,
} from '@whitewater-guide/schema';
import * as yup from 'yup';

import { isInputValidResolver, MutationResolvers } from '~/apollo';

const Schema: yup.SchemaOf<MutationUpsertSectionMediaArgs> = yup.object({
  sectionId: yup.string().uuid().required(),
  media: MediaInputSchema.clone().required(),
});

const upsertSectionMedia: MutationResolvers['upsertSectionMedia'] = async (
  _,
  { media, sectionId },
  { dataSources },
) => {
  await dataSources.users.assertEditorPermissions({ sectionId });
  return dataSources.media.upsertSectionMedia(media, sectionId);
};

export default isInputValidResolver(Schema, upsertSectionMedia);
