import { Kind, struct } from 'superstruct';
import { createValidator } from '../../ww-commons/utils/validation';

export const validateInput = (schema: Kind): any => {
  const validator = createValidator(schema);
  return (value: any) => {
    const errors = validator(value);
    return errors || {};
  };
};

export const MdEditorStruct = struct.object({
  isMarkdown: 'boolean',
  prosemirror: 'object',
  markdown: 'string|null',
});
