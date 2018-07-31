import { struct } from '../../utils/validation';
import { PointInputStruct } from '../points';

const GaugeInputFields = {
  id: struct.union(['uuid', 'null']),
  name: 'nonEmptyString',
  code: 'nonEmptyVarchar',
  levelUnit: 'nonEmptyVarchar|null',
  flowUnit: 'nonEmptyVarchar|null',
  location: struct.union([PointInputStruct, 'null']),
  requestParams: 'object|null',
  cron: struct.union(['cron', 'null']),
  url: struct.union(['url', 'null', struct.literal('')]),
  source: 'node',
};

export const GaugeInputStruct = struct.object(GaugeInputFields);

export const GaugeFormStruct = struct.object({
  ...GaugeInputFields,
  requestParams: struct.union(['jsonString', 'null']),
});
