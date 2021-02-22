import { yupTypes } from '@whitewater-guide/validation';
import * as yup from 'yup';

import { SuggestionInput } from './types';

function makeSuggestingSchema(photoRequired: boolean): any {
  return yup
    .object({
      section: yupTypes.node().defined(),
      description: yup
        .string()
        .defined()
        .nullable(true)
        .test({
          name: 'correct-description',
          message: 'yup:mixed.required',
          test(v) {
            return photoRequired || !!v || !!this.parent.filename;
          },
        }),
      copyright: yup.string().defined().nullable(true),
      filename: yup
        .string()
        .defined()
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
        .defined()
        .min(2)
        .max(2)
        .of(yup.number().integer().positive())
        .nullable(!photoRequired as any)
        .test({
          name: 'correct-resolution',
          message: 'yup:mixed.required',
          test(v) {
            return v ? !!this.parent.filename : !this.parent.filename;
          },
        }) as any,
    })
    .strict(true)
    .noUnknown();
}

export const SuggestionInputSchema: yup.SchemaOf<SuggestionInput> = makeSuggestingSchema(
  false,
);

export const PhotoSuggestionInputSchema: yup.SchemaOf<SuggestionInput> = makeSuggestingSchema(
  true,
);
