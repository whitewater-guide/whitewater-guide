import type { ObjectSchema } from 'yup';
import { bool, object, string } from 'yup';

import type { EditorSettingsInput, UserInput } from '../__generated__/types';
import { LANGUAGES } from '../i18n';

export const UserInputSchema: ObjectSchema<UserInput> = object({
  name: string().notRequired().min(1),
  avatar: string().notRequired().nullable(),
  language: string().oneOf(LANGUAGES).optional(),
  imperial: bool().notRequired(),
  email: string().email().notRequired().nullable(),
})
  .strict(true)
  .noUnknown();

export const EditorSettingsSchema: ObjectSchema<EditorSettingsInput> = object({
  language: string().oneOf(LANGUAGES).required(),
})
  .strict(true)
  .noUnknown();
