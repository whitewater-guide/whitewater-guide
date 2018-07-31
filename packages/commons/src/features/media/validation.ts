import { struct } from '../../utils/validation';
import { MediaKind } from './types';

export const MediaInputStruct = struct.object({
  id: 'uuid|null',
  description: 'string|null',
  copyright: 'string|null',
  url: 'nonEmptyString',
  kind: struct.enum([MediaKind.photo, MediaKind.video, MediaKind.blog]),
  resolution: struct.union([
    struct.tuple(['positiveInteger', 'positiveInteger']),
    'null'],
  ),
  weight: 'integer|null',
});
