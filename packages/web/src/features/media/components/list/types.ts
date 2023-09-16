import type { Media, MediaInput } from '@whitewater-guide/schema';

export type ListedMedia = MediaInput & {
  deleted?: Media['deleted'];
  thumb?: Media['image'];
};
