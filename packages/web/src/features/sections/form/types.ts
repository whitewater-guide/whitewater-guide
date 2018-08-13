import { MdEditorValue } from '@whitewater-guide/md-editor';
import { InjectedFormProps } from 'redux-form';
import { Overwrite } from 'type-zoo';
import { NamedNode, Region, River, SectionInput, Tag } from '../../../ww-commons';

interface FormOverrides {
  description: MdEditorValue;
  river: NamedNode;
}

export type SectionFormInput = Overwrite<SectionInput, FormOverrides> & {
  kayakingTags: Tag[];
  hazardsTags: Tag[];
  supplyTags: Tag[];
  miscTags: Tag[];
};

export interface SectionFormProps extends InjectedFormProps<SectionFormInput> {
  region: Region;
  river: River;
  tags: Tag[];
}
