import { MdEditorValue } from '@whitewater-guide/md-editor';
import { RouteComponentProps } from 'react-router';
import { InjectedFormProps } from 'redux-form';
import { Region, River, SectionFormInput, Tag } from '../../../ww-commons';

export type SectionFormData = SectionFormInput<MdEditorValue>;

export interface SectionFormProps extends InjectedFormProps<SectionFormData>, RouteComponentProps<any> {
  region: Region;
  river: River;
  tags: Tag[];
}
