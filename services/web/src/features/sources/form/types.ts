import { Region, Script, SourceFormInput } from '@whitewater-guide/commons';
import { MdEditorValue } from '@whitewater-guide/md-editor';
import { RouteComponentProps } from 'react-router';
import { InjectedFormProps } from 'redux-form';

export type SourceFormData = SourceFormInput<MdEditorValue>;

export type SourceFormProps = InjectedFormProps<SourceFormData> &
  RouteComponentProps<any> & { scripts: Script[]; regions: Region[] };
