import { MdEditorValue } from '@whitewater-guide/md-editor';
import { Overwrite } from 'type-zoo';
import { RegionInput } from '../../../ww-commons';

export type RegionFormInput = Overwrite<RegionInput, { description: MdEditorValue }>;
