import type { MutationAddSuggestionArgs } from '@whitewater-guide/schema';
import {
  MediaKind,
  PhotoSuggestionInputSchema,
  SuggestionInputSchema,
  SuggestionStatus,
} from '@whitewater-guide/schema';
import { createSafeValidator } from '@whitewater-guide/validation';
import type { ObjectSchema } from 'yup';
import { object } from 'yup';

import type { MutationResolvers } from '../../../apollo/index';
import { UserInputError } from '../../../apollo/index';
import type { Sql } from '../../../db/index';
import { db } from '../../../db/index';
import { MEDIA, s3Client } from '../../../s3/index';

const schemaWithPhoto: ObjectSchema<MutationAddSuggestionArgs> = object({
  suggestion: PhotoSuggestionInputSchema.clone().required(),
});

const schemaWithoutPhoto: ObjectSchema<MutationAddSuggestionArgs> = object({
  suggestion: SuggestionInputSchema.clone().required(),
});

const addSuggestion: MutationResolvers['addSuggestion'] = async (
  _,
  args,
  { dataSources, user },
) => {
  const { suggestion } = args;
  const schema = suggestion.filename ? schemaWithPhoto : schemaWithoutPhoto;
  const validator = createSafeValidator(schema);
  const validationErrors = validator(args);
  if (validationErrors) {
    throw new UserInputError('invalid input', { validationErrors, args });
  }
  const isEditor = await dataSources.users.checkEditorPermissions({
    sectionId: suggestion.section.id,
  });
  const autoApprove = isEditor && !!suggestion.filename;
  const raw: Partial<Sql.Suggestions> = {
    section_id: suggestion.section.id,
    description: suggestion.description,
    copyright: suggestion.copyright,
    filename: s3Client.getLocalFileName(suggestion.filename),
    resolution: suggestion.resolution as [number, number],
    created_by: user ? user.id : null,
    resolved_by: autoApprove ? user?.id : null,
    resolved_at: autoApprove ? (db().fn.now() as any) : null,
    status: autoApprove ? SuggestionStatus.Accepted : SuggestionStatus.Pending,
  };
  const [result] = await db().insert(raw).into('suggestions').returning('*');
  if (autoApprove) {
    await dataSources.media.upsertSectionMedia(
      {
        id: null,
        description: suggestion.description,
        copyright: suggestion.copyright,
        url: suggestion.filename!,
        kind: MediaKind.Photo,
        resolution: suggestion.resolution,
        weight: null,
      },
      suggestion.section.id,
    );
  }
  if (suggestion.filename) {
    await s3Client.moveTempImage(suggestion.filename, MEDIA);
  }
  return result;
};

export default addSuggestion;
