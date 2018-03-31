import { QueryBuilder } from 'knex';
import { baseResolver } from '../../../apollo';
import { buildMediaListQuery } from '../queryBuilder';

interface Variables {
  sectionId: string;
}

const mediaBySection = baseResolver.createResolver(
  (root, { sectionId, ...args }: Variables, context, info) => {
    let query = buildMediaListQuery({ info, context, ...args });
    query = query.whereExists(function(this: QueryBuilder) {
      this.select('*').from('sections_media')
        .where({ section_id: sectionId })
        .whereRaw('media_view.id = sections_media.media_id');
    });
    return query;
  },
);

export default mediaBySection;
