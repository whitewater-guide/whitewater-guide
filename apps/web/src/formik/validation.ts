import type { MdEditorValue } from '@whitewater-guide/md-editor';
import type { ObjectSchema } from 'yup';
import { bool, object, string } from 'yup';

export const MdEditorSchema: ObjectSchema<MdEditorValue> = object({
  isMarkdown: bool().required(),
  prosemirror: object().required(),
  markdown: string().nullable().defined(),
}) as any;
