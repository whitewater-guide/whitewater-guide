import { EditorState } from 'draft-js';
import { Overwrite, RegionInput } from '../../../ww-commons';

export type RegionFormInput = Overwrite<RegionInput, {description: EditorState | null}>;
