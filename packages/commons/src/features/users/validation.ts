import { LANGUAGES } from '../../core';
import { baseStruct } from '../../utils/validation';

export const UserInputStruct = baseStruct.object({
  name: 'nonEmptyString?',
  avatar: 'string?|null',
  language: baseStruct.optional(baseStruct.enum(LANGUAGES)),
  imperial: baseStruct.optional('boolean'),
  email: 'email?|null',
});

export const EditorSettingsStruct = baseStruct.object({
  language: baseStruct.enum(LANGUAGES),
});
