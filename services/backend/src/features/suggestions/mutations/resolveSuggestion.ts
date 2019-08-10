import { MutationNotAllowedError, TopLevelResolver } from '@apollo';
import db from '@db';
import { MediaKind, SuggestionStatus } from '@whitewater-guide/commons';
import { UserInputError } from 'apollo-server-errors';
import { SuggestionRaw } from '../raw_types';

interface Vars {
  id: string;
  status: SuggestionStatus;
}

const resolveSuggestion: TopLevelResolver<Vars> = async (
  root,
  { id, status },
  { dataSources, user },
) => {
  const suggestion: SuggestionRaw | undefined = await db()
    .select('*')
    .from('suggestions')
    .where({ id })
    .first();
  if (!suggestion) {
    throw new UserInputError('suggestion not found');
  }
  if (suggestion.status !== SuggestionStatus.PENDING) {
    throw new MutationNotAllowedError(
      'cannot resolve already resolved suggestion',
    );
  }
  await dataSources.users.assertEditorPermissions({
    sectionId: suggestion.section_id,
  });
  const [newSuggestion] = await db()
    .table('suggestions')
    .update({ status, resolved_by: user!.id, resolved_at: db().fn.now() })
    .where({ id })
    .returning('*');

  if (suggestion.filename && status === SuggestionStatus.ACCEPTED) {
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
      suggestion.section_id,
      suggestion.created_by,
    );
  }

  return {
    ...suggestion,
    ...newSuggestion,
  };
};

export default resolveSuggestion;
