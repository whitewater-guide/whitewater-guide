import { isAuthenticatedResolver, ListQuery, TopLevelResolver } from '@apollo';
import { SuggestionsFilter } from '@whitewater-guide/commons';
import { ForbiddenError } from 'apollo-server-errors';
import { QueryBuilder } from 'knex';

interface Vars extends ListQuery {
  filter?: SuggestionsFilter;
}

const suggestions: TopLevelResolver<Vars> = async (
  _,
  { filter = {}, page },
  { user, dataSources },
  info,
) => {
  const { status, userId } = filter;
  let query = dataSources.suggestions.getMany(info, { page });
  if (status) {
    query = query.whereIn('status', status);
  }
  if (userId) {
    if (!user || (!user.admin && user.id !== userId)) {
      throw new ForbiddenError('forbidden');
    }
    query = query.where({ created_by: userId });
  } else if (!user!.admin) {
    query = query.whereExists((qb: QueryBuilder) =>
      qb
        .select('user_id')
        .from('regions_editors')
        .innerJoin('rivers', 'regions_editors.region_id', 'rivers.region_id')
        .innerJoin('sections', 'sections.river_id', 'rivers.id')
        .whereRaw('sections.id = suggestions.section_id')
        .where('regions_editors.user_id', '=', user!.id),
    );
  }
  const result = await query;
  return result;
};

export default isAuthenticatedResolver(suggestions);
