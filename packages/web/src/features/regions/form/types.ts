import { MdEditorValue } from '@whitewater-guide/md-editor';
import { RegionInput } from '@whitewater-guide/schema';
import { Overwrite } from 'utility-types';

export type RegionFormData = Overwrite<
  RegionInput,
  { description: MdEditorValue }
>;

export interface RouterParams {
  regionId?: string;
}
