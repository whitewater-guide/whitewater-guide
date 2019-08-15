import { isInputValidResolver, TopLevelResolver } from '@apollo';
import db from '@db';
import { MEDIA, moveTempImage } from '@minio';
import {
  MediaKind,
  SuggestionInput,
  SuggestionInputSchema,
  SuggestionStatus,
} from '@whitewater-guide/commons';
import * as yup from 'yup';
import { SuggestionRaw } from '../types';

const schema = yup.object({
  suggestion: SuggestionInputSchema,
});

interface Vars {
  suggestion: SuggestionInput;
}

const addSuggestion: TopLevelResolver<Vars> = async (
  root,
  { suggestion },
  { dataSources, user },
) => {
  const isEditor = await dataSources.users.checkEditorPermissions({
    sectionId: suggestion.section.id,
  });
  const autoApprove = isEditor && !!suggestion.filename;
  const raw: Partial<SuggestionRaw> = {
    section_id: suggestion.section.id,
    description: suggestion.description,
    copyright: suggestion.copyright,
    filename: suggestion.filename,
    resolution: suggestion.resolution,
    created_by: user ? user.id : null,
    resolved_by: autoApprove ? user!.id : null,
    resolved_at: autoApprove ? (db().fn.now() as any) : null,
    status: autoApprove ? SuggestionStatus.ACCEPTED : SuggestionStatus.PENDING,
  };
  const [result] = await db()
    .insert(raw)
    .into('suggestions')
    .returning('*');
  if (autoApprove) {
    await dataSources.media.upsertSectionMedia(
      {
        id: null,
        description: suggestion.description,
        copyright: suggestion.copyright,
        url: suggestion.filename,
        kind: MediaKind.photo,
        resolution: suggestion.resolution,
        weight: null,
      },
      suggestion.section.id,
    );
  }
  if (suggestion.filename) {
    await moveTempImage(suggestion.filename, MEDIA);
  }
  return result;
};

export default isInputValidResolver(schema, addSuggestion);
