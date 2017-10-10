import { EditorState } from 'draft-js';
import { Overwrite, SourceInput } from '../../../ww-commons';

export type SourceFormInput = Overwrite<SourceInput, {termsOfUse: EditorState | null}>;
