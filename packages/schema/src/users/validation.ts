import * as yup from 'yup';

import { EditorSettingsInput, UserInput } from '../__generated__/types';
import { LANGUAGES } from '../i18n';

export const UserInputSchema: yup.SchemaOf<UserInput> = yup
  .object({
    name: yup.string().notRequired().min(1),
    avatar: yup.string().notRequired().nullable(),
    language: yup.string().oneOf(LANGUAGES).optional(),
    imperial: yup.bool().notRequired(),
    email: yup.string().email().notRequired().nullable(),
  })
  .strict(true)
  .noUnknown();

export const EditorSettingsSchema: yup.SchemaOf<EditorSettingsInput> = yup
  .object({
    language: yup.string().oneOf(LANGUAGES).required(),
  })
  .strict(true)
  .noUnknown();
