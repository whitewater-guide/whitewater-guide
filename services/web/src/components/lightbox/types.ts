import { Media, MediaKind } from '@whitewater-guide/commons';

export type LightboxItem = Pick<
  Media,
  'id' | 'image' | 'description' | 'copyright'
> & { url?: string; kind?: MediaKind };
