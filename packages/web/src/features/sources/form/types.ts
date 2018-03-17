import { EditorState } from 'draft-js';
import { InjectedFormProps } from 'redux-form';
import { Overwrite } from 'type-zoo';
import { Region, Script, SourceInput } from '../../../ww-commons';

export type SourceFormInput = Overwrite<SourceInput, {termsOfUse: EditorState | null, script: Script}>;
export type SourceFormProps = {scripts: Script[], regions: Region[] } & InjectedFormProps<SourceFormInput>;
