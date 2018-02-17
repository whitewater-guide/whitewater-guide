import { InjectedFormProps } from 'redux-form';
import { Region, River, SectionInput, Tag } from '../../../ww-commons';

export interface SectionFormProps extends InjectedFormProps<SectionInput> {
  region: Region;
  river: River;
  tags: Tag[];
}
