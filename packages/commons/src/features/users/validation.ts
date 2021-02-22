import * as yup from 'yup';

import { LANGUAGES } from '../../i18n';
import { EditorSettings, UserInput } from './types';

export const UserInputSchema: yup.SchemaOf<UserInput> = yup
  .object({
    name: yup.string().notRequired().min(1),
    avatar: yup.string().notRequired().nullable(),
    language: yup.string().oneOf(LANGUAGES),
    imperial: yup.bool().notRequired(),
    email: yup.string().email().notRequired().nullable(),
  })
  .strict(true)
  .noUnknown();

export const EditorSettingsSchema: yup.SchemaOf<EditorSettings> = yup
  .object({
    language: yup.string().oneOf(LANGUAGES).defined().nullable(false),
  })
  .strict(true)
  .noUnknown();
