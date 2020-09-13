import { Overwrite, RegionInput } from '@whitewater-guide/commons';
import { MdEditorValue } from '@whitewater-guide/md-editor';

export type RegionFormData = Overwrite<
  RegionInput,
  { description: MdEditorValue }
>;

export interface RouterParams {
  regionId?: string;
}
