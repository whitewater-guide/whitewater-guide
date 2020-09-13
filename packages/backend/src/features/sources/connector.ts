import { Source } from '@whitewater-guide/commons';

import { FieldsMap, OffsetConnector } from '~/db/connectors';

import { SourceRaw } from './types';

const FIELDS_MAP: FieldsMap<Source, SourceRaw> = {
  status: 'script',
  enabled: null,
  gauges: null,
  regions: null,
};

export class SourcesConnector extends OffsetConnector<Source, SourceRaw> {
  constructor() {
    super();
    this._tableName = 'sources_view';
    this._graphqlTypeName = 'Source';
    this._fieldsMap = FIELDS_MAP;
  }
}
