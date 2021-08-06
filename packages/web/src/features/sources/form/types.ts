import { MdEditorValue } from '@whitewater-guide/md-editor';
import { Script, SourceInput } from '@whitewater-guide/schema';
import { Overwrite } from 'utility-types';

export type SourceFormData = Overwrite<
  SourceInput,
  {
    termsOfUse: MdEditorValue;
    requestParams?: string | null;
    script: Script;
  }
>;

export interface RouterParams {
  sourceId?: string;
}
