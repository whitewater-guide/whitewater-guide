import { baseStruct } from '../../utils/validation';
import { POITypes } from './POITypes';

export const CoordinateStruct = baseStruct.tuple([
  'longitude',
  'latitude',
  'number',
]);

export const CoordinateStructLoose = baseStruct.tuple([
  'longitude',
  'latitude',
  'number?',
]);

export const PointInputStruct = baseStruct.object({
  id: 'uuid|null',
  name: 'string|null',
  description: 'string|null',
  coordinates: CoordinateStruct,
  kind: baseStruct.enum(POITypes),
});
