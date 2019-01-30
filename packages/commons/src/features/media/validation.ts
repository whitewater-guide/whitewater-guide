import { baseStruct } from '../../utils/validation';
import { MediaKind } from './types';

export const MediaInputStruct = baseStruct.object({
  id: 'uuid|null',
  description: 'string|null',
  copyright: 'string|null',
  url: 'nonEmptyString',
  kind: baseStruct.enum([MediaKind.photo, MediaKind.video, MediaKind.blog]),
  resolution: baseStruct.union([
    baseStruct.tuple(['positiveInteger', 'positiveInteger']),
    'null',
  ]),
  weight: 'integer|null',
});
