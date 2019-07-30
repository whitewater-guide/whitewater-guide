import * as yup from 'yup';
import { LANGUAGES } from '../../i18n';
import { EditorSettings, UserInput } from './types';

export const UserInputSchema = yup
  .object<UserInput>({
    name: yup
      .string()
      .notRequired()
      .min(1),
    avatar: yup
      .string()
      .notRequired()
      .nullable(),
    language: yup.string().oneOf(LANGUAGES),
    imperial: yup.bool().notRequired(),
    email: yup
      .string()
      .email()
      .notRequired()
      .nullable(),
  })
  .strict(true)
  .noUnknown();

export const EditorSettingsSchema = yup
  .object<EditorSettings>({
    language: yup.string().oneOf(LANGUAGES),
  })
  .strict(true)
  .noUnknown();
