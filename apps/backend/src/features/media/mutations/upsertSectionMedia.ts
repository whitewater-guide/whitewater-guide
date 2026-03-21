import type { MutationUpsertSectionMediaArgs } from '@whitewater-guide/schema';
import { MediaInputSchema } from '@whitewater-guide/schema';
import type { ObjectSchema } from 'yup';
import { object, string } from 'yup';

import type { MutationResolvers } from '../../../apollo/index';
import { isInputValidResolver } from '../../../apollo/index';

const Schema: ObjectSchema<MutationUpsertSectionMediaArgs> = object({
  sectionId: string().uuid().required(),
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
