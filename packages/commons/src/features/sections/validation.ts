import isArray from 'lodash/isArray';
import isString from 'lodash/isString';
import omit from 'lodash/omit';
import times from 'lodash/times';
import { Type } from 'superstruct';
import { customStruct } from '../../utils/validation';
import { CoordinateStruct, PointInputStruct } from '../points';
import { TagInputStruct } from '../tags';
import { Durations } from './types';

const struct = customStruct({
  difficultyXtra: (v: any) => {
    if (!isString(v) || v.length > 32) {
      return 'Must be string no longer than 32 chars';
    }
    return true;
  },
  shapeArray: (v: any) =>
    (isArray(v) && v.length >= 2) || 'Minimal length is 2',
});

export const GaugeBindingStruct = struct.object({
  minimum: 'number?|null',
  maximum: 'number?|null',
  optimum: 'number?|null',
  impossible: 'number?|null',
  approximate: 'boolean?|null',
  formula: 'formula?|null',
});

const SimpleTagStruct = struct.object({
  id: 'nonEmptyVarchar',
});

const SectionInputFields = {
  id: 'uuid|null',
  name: 'nonEmptyString',
  altNames: struct.union([struct.list(['nonEmptyString']), 'null']),
  description: 'string|null',
  season: 'string|null',
  seasonNumeric: struct.intersection([['halfMonth'], 'seasonNumeric']),

  river: 'node',
  gauge: 'node|null',
  levels: struct.union([GaugeBindingStruct, 'null']),
  flows: struct.union([GaugeBindingStruct, 'null']),
  flowsText: 'string|null',

  shape: struct.intersection(['shapeArray', [CoordinateStruct]]),
  distance: 'positiveNumber|null',
  drop: 'positiveNumber|null',
  duration: struct.union(['null', struct.enum(Array.from(Durations.keys()))]),
  difficulty: struct.enum(times(13, (i) => i * 0.5)),
  difficultyXtra: 'difficultyXtra|null',
  rating: struct.union(['null', struct.enum(times(11, (i) => i * 0.5))]),
  tags: [SimpleTagStruct],
  pois: [PointInputStruct],
  hidden: 'boolean',
};

export const SectionInputStruct = struct.object(SectionInputFields);

export const SectionFormStruct = (richTextStruct?: Type) =>
  struct.object({
    ...omit(SectionInputFields, 'tags'),
    description: richTextStruct || 'any',
    kayakingTags: [TagInputStruct],
    hazardsTags: [TagInputStruct],
    supplyTags: [TagInputStruct],
    miscTags: [TagInputStruct],
  });

export const SectionAdminSettingsStruct = struct.object({
  demo: 'boolean',
});
