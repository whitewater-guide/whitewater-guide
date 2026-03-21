import type { MdEditorValue } from '@whitewater-guide/md-editor';
import type { RegionInput } from '@whitewater-guide/schema';
import type { Overwrite } from 'utility-types';

export type RegionFormData = Overwrite<
  RegionInput,
  { description: MdEditorValue }
>;

export interface RouterParams {
  regionId?: string;
}
