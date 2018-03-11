import { buildRootQuery, QueryBuilderOptions } from '../../db';
import { Tag } from '../../ww-commons';

export const buildTagsListQuery = (options: Partial<QueryBuilderOptions<Tag>>) =>
  buildRootQuery({
    info: options.info!,
    context: options.context!,
    table: 'tags_view',
    orderBy: 'name',
    ...options,
  });
