import { isAuthenticatedResolver, ListQuery, TopLevelResolver } from '~/apollo';
import { SuggestionsFilter } from '@whitewater-guide/commons';
import { ForbiddenError } from 'apollo-server-errors';
import { QueryBuilder } from 'knex';

interface Vars extends ListQuery {
  filter?: SuggestionsFilter;
}

const suggestedSections: TopLevelResolver<Vars> = async (
  _,
  { filter = {}, page },
  { user, dataSources },
  info,
) => {
  const { status, userId } = filter;
  let query = dataSources.suggestedSections.getMany(info, { page });
  if (status) {
    query = query.whereIn('status', status);
  }
  if (userId) {
    if (!user || (!user.admin && user.id !== userId)) {
      throw new ForbiddenError('forbidden');
    }
    query = query.whereRaw("section ->> 'createdBy' = ?", [userId]);
  } else if (!user!.admin) {
    query = query.whereExists((qb: QueryBuilder) =>
      qb
        .select('user_id')
        .from('regions_editors')
        .whereRaw(
          "regions_editors.region_id = (suggested_sections.section -> 'region' ->> 'id') :: UUID",
        )
        .where('regions_editors.user_id', '=', user!.id),
    );
  }
  const result = await query;
  return result;
};

export default isAuthenticatedResolver(suggestedSections);
