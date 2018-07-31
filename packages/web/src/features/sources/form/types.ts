import { MdEditorValue } from '@whitewater-guide/md-editor';
import { RouteComponentProps } from 'react-router';
import { InjectedFormProps } from 'redux-form';
import { Overwrite } from 'type-zoo';
import { Region, Script, SourceInput } from '../../../ww-commons';

export type SourceFormInput = Overwrite<SourceInput, {termsOfUse: MdEditorValue, script: Script}>;
export type SourceFormProps = InjectedFormProps<SourceFormInput> &
  RouteComponentProps<any> &
  {scripts: Script[], regions: Region[] };
