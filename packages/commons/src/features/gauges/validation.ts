import { baseStruct } from '../../utils/validation';
import { PointInputStruct } from '../points';

const GaugeInputFields = {
  id: baseStruct.union(['uuid', 'null']),
  name: 'nonEmptyString',
  code: 'nonEmptyVarchar',
  levelUnit: 'nonEmptyVarchar|null',
  flowUnit: 'nonEmptyVarchar|null',
  location: baseStruct.union([PointInputStruct, 'null']),
  requestParams: 'object|null',
  cron: baseStruct.union(['cron', 'null']),
  url: baseStruct.union(['url', 'null', baseStruct.literal('')]),
  source: 'node',
};

export const GaugeInputStruct = baseStruct.object(GaugeInputFields);

export const GaugeFormStruct = baseStruct.object({
  ...GaugeInputFields,
  requestParams: baseStruct.union(['jsonString', 'null']),
});
