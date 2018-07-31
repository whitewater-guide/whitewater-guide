import { struct } from '../../utils/validation';
import { POITypes } from './POITypes';

export const CoordinateStruct = struct.tuple([
  'longitude',
  'latitude',
  'number',
]);

export const CoordinateStructLoose = struct.tuple([
  'longitude',
  'latitude',
  'number?',
]);

export const PointInputStruct = struct.object({
  id: 'uuid|null',
  name: 'string|null',
  description: 'string|null',
  coordinates: CoordinateStruct,
  kind: struct.enum(POITypes),
});
