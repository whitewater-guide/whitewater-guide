import {
  NamedNode,
  Overwrite,
  Script,
  SourceInput,
} from '@whitewater-guide/commons';
import { MdEditorValue } from '@whitewater-guide/md-editor';

export type SourceFormData = Overwrite<
  SourceInput,
  {
    termsOfUse: MdEditorValue;
    script: Script;
    regions: NamedNode[];
  }
>;

export interface RouterParams {
  sourceId?: string;
}
