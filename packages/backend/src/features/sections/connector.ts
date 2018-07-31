import { AuthenticationRequiredError, ForbiddenError } from '@apollo';
import db from '@db';
import { BaseConnector, FieldsMap, ManyBuilderOptions } from '@db/connectors';
import { Section } from '@ww-commons';
import { GraphQLResolveInfo } from 'graphql';
import { QueryBuilder } from 'knex';
import { SectionRaw, SectionsFilter } from './types';

interface GetManyOptions extends ManyBuilderOptions<SectionRaw> {
  filter?: SectionsFilter;
}

const FIELDS_MAP: FieldsMap<Section, SectionRaw> = {
  // premium determines description visibility
  description: ['description', 'premium', 'river_id', 'region_id', 'demo'],
  region: 'region_id',
  river: ['river_id', 'river_name'],
  gauge: 'gauge_id',
};

export class SectionsConnector extends BaseConnector<Section, SectionRaw> {

  constructor() {
    super();
    this._tableName = 'sections_view';
    this._graphqlTypeName = 'Section';
    this._fieldsMap = FIELDS_MAP;
    this._orderBy = [
      { column: 'river_name', direction: 'asc' },
      { column: 'name', direction: 'asc' },
      { column: 'created_at', direction: 'desc' },
      { column: 'id', direction: 'asc' },
    ];
  }

  private addHiddenWhere(query: QueryBuilder) {
    const user = this._user;
    if (!user) {
      query.where('sections_view.hidden', false);
    } else if (!user.admin) {
      query.where((qb) => {
        qb
          .where('sections_view.hidden', false)
          .orWhereIn('sections_view.region_id', function(this: QueryBuilder) {
            this.select('regions_editors.region_id')
              .from('regions_editors')
              .where('regions_editors.user_id', user.id);
          });
      });
    }
    return query;
  }

  getBatchQueue(keys: string[]): QueryBuilder {
    const query = super.getBatchQuery(keys);
    this.addHiddenWhere(query);
    return query;
  }

  getMany(info: GraphQLResolveInfo, { filter = {}, ...options }: GetManyOptions = {}) {
    const query = super.getMany(info, options);
    this.addHiddenWhere(query);

    const { riverId, regionId, updatedAfter } = filter;
    if (riverId) {
      query.where({ river_id: riverId });
    } else if (regionId) {
      query.where({ region_id: regionId });
    }
    if (updatedAfter) {
      query.where('sections_view.updated_at', '>', updatedAfter);
    }

    return query;
  }

  async assertEditorPermissions(id?: string | null, riverId?: string) {
    if (!this._user) {
      throw new AuthenticationRequiredError();
    }
    if (this._user.admin) {
      return true;
    }
    if (!riverId && !id) {
      throw new ForbiddenError();
    }
    const query = db()
      .select('regions_editors.region_id')
      .from('regions_editors')
      .where({ user_id: this._user.id })
      .innerJoin('rivers', 'regions_editors.region_id', '=', 'rivers.region_id');
    if (riverId) {
      query.where('rivers.id', riverId);
    } else if (id) {
      query.innerJoin('sections', 'rivers.id', '=', 'sections.river_id')
        .where('sections.id', id);
    }

    const { rows: [{ exists }] } = await db().raw(`SELECT EXISTS (${query.toString()})`);
    if (!exists) {
      throw new ForbiddenError();
    }
    return true;
  }

}
