import { SectionInput, SuggestedSection } from '@whitewater-guide/commons';
import { DataSourceConfig } from 'apollo-datasource';
import { Context } from '~/apollo';
import { knex } from '~/db';
import { FieldsMap, OffsetConnector } from '~/db/connectors';
import { SuggestedSectionRaw } from './types';

const FIELDS_MAP: FieldsMap<
  SuggestedSection<SectionInput>,
  SuggestedSectionRaw
> = {
  name: knex.raw("section ->> 'name' AS name"),
  region: knex.raw("section -> 'region' AS region"),
  river: knex.raw("section -> 'river' AS river"),
  createdBy: 'section',
};

export class SuggestedSectionsConnector extends OffsetConnector<
  SuggestedSection<SectionInput>,
  SuggestedSectionRaw
> {
  constructor() {
    super();
    this._tableName = 'suggested_sections';
    this._graphqlTypeName = 'SuggestedSection';
    this._fieldsMap = FIELDS_MAP;
    this._orderBy = [
      { column: 'created_at', direction: 'desc' },
      { column: 'id', direction: 'asc' },
    ];
  }

  initialize(config: DataSourceConfig<Context>) {
    super.initialize(config);
    this._language = undefined;
  }
}
