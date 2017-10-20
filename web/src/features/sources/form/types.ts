import { EditorState } from 'draft-js';
import { InjectedFormProps } from 'redux-form';
import { Overwrite, Region, Script, SourceInput } from '../../../ww-commons';

export type SourceFormInput = Overwrite<SourceInput, {termsOfUse: EditorState | null}>;
export type SourceFormProps = {scripts: Script[], regions: Region[] } & InjectedFormProps<any>;
