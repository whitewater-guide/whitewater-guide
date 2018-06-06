import { EditorState } from 'draft-js';
import { Overwrite } from 'type-zoo';
import { RegionInput } from '../../../ww-commons';

export type RegionFormInput = Overwrite<RegionInput, {description: EditorState | null}>;
