import { Section, SectionsFilter } from '@whitewater-guide/commons';
import { AuthenticationError, ForbiddenError } from 'apollo-server-koa';
import { GraphQLResolveInfo } from 'graphql';
import { QueryBuilder } from 'knex';

import { UnknownError } from '~/apollo';
import db from '~/db';
import {
  FieldsMap,
  ManyBuilderOptions,
  OffsetConnector,
} from '~/db/connectors';

import { SectionRaw } from './types';

interface GetManyOptions extends ManyBuilderOptions<SectionRaw> {
  filter?: SectionsFilter;
}

const FIELDS_MAP: FieldsMap<Section, SectionRaw> = {
  // premium determines description visibility
  description: ['description', 'premium', 'river_id', 'region_id', 'demo'],
  region: ['region_id', 'region_name'],
  river: ['river_id', 'river_name'],
  takeOut: ['river_id', 'river_name', 'put_in'],
  putIn: ['river_id', 'river_name', 'take_out'],
  gauge: 'gauge_id',
  media: null,
};

export class SectionsConnector extends OffsetConnector<Section, SectionRaw> {
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
        qb.where('sections_view.hidden', false).orWhereIn(
          'sections_view.region_id',
          function (this: QueryBuilder) {
            this.select('regions_editors.region_id')
              .from('regions_editors')
              .where('regions_editors.user_id', user.id);
          },
        );
      });
    }
    return query;
  }

  getBatchQueue(keys: string[]): QueryBuilder {
    const query = super.getBatchQuery(keys);
    this.addHiddenWhere(query);
    return query;
  }

  getMany(
    info: GraphQLResolveInfo,
    { filter = {}, ...options }: GetManyOptions = {},
  ) {
    const query = super.getMany(info, options);
    this.addHiddenWhere(query);

    const {
      riverId,
      regionId,
      updatedAfter,
      search,
      verified,
      editable,
    } = filter;

    if (verified) {
      query.where({ verified });
    } else if (verified === false) {
      query.where(function () {
        this.where('sections_view.verified', '=', false).orWhereNull(
          'sections_view.verified',
        );
      });
    }

    if (riverId) {
      query.where({ river_id: riverId });
    } else if (regionId) {
      query.where({ region_id: regionId });
    }

    if (updatedAfter) {
      query.where('sections_view.updated_at', '>', updatedAfter);
    }

    if (editable && !!this._user && !this._user.admin) {
      const uid = this._user?.id;
      query.whereExists(function (this: QueryBuilder) {
        this.select('*')
          .from('regions_editors')
          .where('regions_editors.user_id', uid)
          .whereRaw(
            '"regions_editors"."region_id" = "sections_view"."region_id"',
          );
      });
    }

    const searchStr = search?.trim().toLocaleLowerCase();
    if (searchStr) {
      query.where(function () {
        this.where('sections_view.name', 'ILIKE', `%${searchStr}%`)
          .orWhere('sections_view.river_name', 'ILIKE', `%${searchStr}%`)
          .orWhereRaw(
            `similarity("sections_view"."river_name" || ' ' || "sections_view"."name", ?::text) > 0.5`,
            searchStr,
          )
          .orWhereExists(function () {
            this.select('*')
              .from(db().raw('unnest(sections_view.alt_names) namez'))
              .where('namez', 'ILIKE', `%${searchStr}%`);
          });
      });
    }

    return query;
  }

  async assertEditorPermissions(id?: string | null, riverId?: string) {
    if (!this._user) {
      throw new AuthenticationError('must authenticate');
    }
    if (this._user.admin) {
      return true;
    }
    if (!riverId && !id) {
      throw new UnknownError('this should not happen');
    }
    const query = db()
      .select('regions_editors.region_id')
      .from('regions_editors')
      .where({ user_id: this._user.id })
      .innerJoin(
        'rivers',
        'regions_editors.region_id',
        '=',
        'rivers.region_id',
      );
    if (riverId) {
      query.where('rivers.id', riverId);
    } else if (id) {
      query
        .innerJoin('sections', 'rivers.id', '=', 'sections.river_id')
        .where('sections.id', id);
    }

    const {
      rows: [{ exists }],
    } = await db().raw(`SELECT EXISTS (${query.toString()})`);
    if (!exists) {
      throw new ForbiddenError('must be editor');
    }
    return true;
  }
}