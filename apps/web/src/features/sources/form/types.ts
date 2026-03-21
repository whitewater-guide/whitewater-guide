import type { MdEditorValue } from '@whitewater-guide/md-editor';
import type { Script, SourceInput } from '@whitewater-guide/schema';
import type { Overwrite } from 'utility-types';

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
