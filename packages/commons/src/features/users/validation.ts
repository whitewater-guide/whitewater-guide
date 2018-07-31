import { LANGUAGES } from '../../core';
import { struct } from '../../utils/validation';

export const UserInputStruct = struct.object({
  name: 'nonEmptyString?',
  avatar: 'string?|null',
  language: struct.optional(struct.enum(LANGUAGES)),
  imperial: struct.optional('boolean'),
});

export const EditorSettingsStruct = struct.object({
  language: struct.enum(LANGUAGES),
});
