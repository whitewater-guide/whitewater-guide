import { ContextUser } from '@apollo';
import { BaseModel, FieldsMap } from '@db/model';
import { Gauge } from '@ww-commons';
import { GaugeRaw } from './types';

const FIELDS_MAP: FieldsMap<Gauge, GaugeRaw> = {
  lastMeasurement: 'script',
  status: 'source_id',
  source: 'source_id',
};

export class GaugesConnector extends BaseModel<Gauge, GaugeRaw> {

  constructor(user: ContextUser | undefined, language: string, fieldsByType: Map<string, Set<string>>) {
    super(user, language, fieldsByType);
    this._tableName = 'gauges_view';
    this._graphqlTypeName = 'Gauge';
    this._fieldsMap = FIELDS_MAP;
  }

}
