import { MutationNotAllowedError, TopLevelResolver } from '~/apollo';
import db, { knex } from '~/db';
import { SuggestionStatus } from '@whitewater-guide/commons';
import { UserInputError } from 'apollo-server-errors';

interface Vars {
  id: string;
}

const rejectSuggestedSection: TopLevelResolver<Vars> = async (
  root,
  { id },
  { dataSources, user },
) => {
  const suggestedSection = await db()
    .select([
      'id',
      'status',
      knex.raw("section -> 'region' ->> 'id' as region_id"),
    ])
    .from('suggested_sections')
    .where({ id })
    .first();
  if (!suggestedSection) {
    throw new UserInputError('suggested section not found');
  }
  if (suggestedSection.status !== SuggestionStatus.PENDING) {
    throw new MutationNotAllowedError(
      'cannot resolve already resolved suggestion',
    );
  }
  await dataSources.users.assertEditorPermissions({
    regionId: suggestedSection.region_id,
  });
  const [result] = await db()
    .table('suggested_sections')
    .update({
      status: SuggestionStatus.REJECTED,
      resolved_by: user!.id,
      resolved_at: db().fn.now(),
    })
    .where({ id })
    .returning('*');

  return result;
};

export default rejectSuggestedSection;
