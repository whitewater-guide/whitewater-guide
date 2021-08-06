import { yupSchemas } from '@whitewater-guide/validation';
import * as yup from 'yup';

import { SuggestionInput } from '../__generated__/types';

function makeSuggestingSchema(
  photoRequired: boolean,
): yup.SchemaOf<SuggestionInput> {
  return yup
    .object({
      section: yupSchemas.refInput().defined(),
      description: yup
        .string()
        .nullable(true)
        .test({
          name: 'correct-description',
          message: 'yup:mixed.required',
          test(v) {
            return photoRequired || !!v || !!this.parent.filename;
          },
        }),
      copyright: yup.string().nullable(true),
      filename: yup
        .string()
        // nullable typedf is tricky
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .nullable(!photoRequired as any)
        .test({
          name: 'correct-filename',
          message: 'yup:mixed.required',
          test(v) {
            if (!v) {
              return !!this.parent.description;
            }
            return !!this.parent.resolution;
          },
        }),
      resolution: yup
        .array()
        .of(yup.number().integer().positive())
        .min(2)
        .max(2)
        .optional()
        // nullable typedf is tricky
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .nullable(!photoRequired as any)
        .test({
          name: 'correct-resolution',
          message: 'yup:mixed.required',
          test(v: SuggestionInput) {
            return v ? !!this.parent.filename : !this.parent.filename;
          },
        }),
    })
    .strict(true)
    .noUnknown();
}

export const SuggestionInputSchema: yup.SchemaOf<SuggestionInput> =
  makeSuggestingSchema(false);

export const PhotoSuggestionInputSchema: yup.SchemaOf<SuggestionInput> =
  makeSuggestingSchema(true);
