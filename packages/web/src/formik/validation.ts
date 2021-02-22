import { MdEditorValue } from '@whitewater-guide/md-editor';
import * as yup from 'yup';

export const MdEditorSchema: yup.SchemaOf<MdEditorValue> = yup.object({
  isMarkdown: yup.bool().defined(),
  prosemirror: yup.object(),
  markdown: yup.string().nullable().defined(),
});
