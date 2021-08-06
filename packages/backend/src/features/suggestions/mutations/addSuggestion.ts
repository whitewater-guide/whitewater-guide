import {
  MediaKind,
  MutationAddSuggestionArgs,
  SuggestionInputSchema,
  SuggestionStatus,
} from '@whitewater-guide/schema';
import * as yup from 'yup';

import { isInputValidResolver, MutationResolvers } from '~/apollo';
import { db, Sql } from '~/db';
import { MEDIA, s3Client } from '~/s3';

const schema: yup.SchemaOf<MutationAddSuggestionArgs> = yup.object({
  suggestion: SuggestionInputSchema,
});

const addSuggestion: MutationResolvers['addSuggestion'] = async (
  _,
  { suggestion },
  { dataSources, user },
) => {
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
        url: suggestion.filename,
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

export default isInputValidResolver(schema, addSuggestion);
