import { BaseConnector, FieldsMap, ManyBuilderOptions } from '@db/connectors';
import { Media } from '@whitewater-guide/commons';
import { GraphQLResolveInfo } from 'graphql';
import { QueryBuilder } from 'knex';
import { MediaRaw } from './types';

const FIELDS_MAP: FieldsMap<Media, MediaRaw> = {
  deleted: null,
  image: null,
};

interface GetManyOptions extends ManyBuilderOptions<MediaRaw> {
  sectionId: string;
}

export class MediaConnector extends BaseConnector<Media, MediaRaw> {
  constructor() {
    super();
    this._tableName = 'media_view';
    this._graphqlTypeName = 'Media';
    this._fieldsMap = FIELDS_MAP;
    this._orderBy = [
      { column: 'weight', direction: 'desc' },
      { column: 'created_at', direction: 'desc' },
    ];
  }

  getMany(info: GraphQLResolveInfo, { sectionId, ...options }: GetManyOptions) {
    const query = super.getMany(info, options);
    query.whereExists(function(this: QueryBuilder) {
      this.select('*')
        .from('sections_media')
        .where({ section_id: sectionId })
        .whereRaw('media_view.id = sections_media.media_id');
    });
    return query;
  }
}
