import { MediaKind, SuggestionStatus } from '@whitewater-guide/schema';

import type { MutationResolvers } from '../../../apollo/index';
import { MutationNotAllowedError, UserInputError } from '../../../apollo/index';
import type { Sql } from '../../../db/index';
import { db } from '../../../db/index';

const resolveSuggestion: MutationResolvers['resolveSuggestion'] = async (
  _,
  { id, status },
  { dataSources, user },
) => {
  const suggestion: Sql.Suggestions | undefined = await db()
    .select('*')
    .from('suggestions')
    .where({ id })
    .first();
  if (!suggestion) {
    throw new UserInputError('suggestion not found');
  }
  if (suggestion.status !== SuggestionStatus.Pending) {
    throw new MutationNotAllowedError(
      'cannot resolve already resolved suggestion',
    );
  }
  await dataSources.users.assertEditorPermissions({
    sectionId: suggestion.section_id,
  });
  const [newSuggestion] = await db()
    .table('suggestions')
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unnecessary-type-assertion
    .update({ status, resolved_by: user!.id, resolved_at: db().fn.now() })
    .where({ id })
    .returning('*');

  if (suggestion.filename && status === SuggestionStatus.Accepted) {
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
      suggestion.section_id,
      suggestion.created_by ?? undefined,
    );
  }

  return {
    ...suggestion,
    ...newSuggestion,
  };
};

export default resolveSuggestion;
