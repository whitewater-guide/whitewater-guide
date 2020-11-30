import { River } from '@whitewater-guide/commons';
import { FieldsMap, OffsetConnector } from '~/db/connectors';
import { RiverRaw } from './types';

const FIELDS_MAP: FieldsMap<River, RiverRaw> = {
  region: 'region_id',
  sections: null,
};

export class RiversConnector extends OffsetConnector<River, RiverRaw> {
  constructor() {
    super();
    this._tableName = 'rivers_view';
    this._graphqlTypeName = 'River';
    this._fieldsMap = FIELDS_MAP;
  }
}