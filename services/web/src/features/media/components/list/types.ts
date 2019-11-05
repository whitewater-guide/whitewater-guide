import { MediaInput } from '@whitewater-guide/commons';

export interface MediaOrInput extends MediaInput {
  deleted?: boolean;
  thumb?: string | null;
}
