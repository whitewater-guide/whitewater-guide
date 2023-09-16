import { yupSchemas } from '@whitewater-guide/validation';
import type { ObjectSchema } from 'yup';
import { array, number, object, string } from 'yup';

import type { SuggestionInput } from '../__generated__/types';

function makeSuggestingSchema(
  photoRequired: boolean,
): ObjectSchema<SuggestionInput> {
  const description = photoRequired
    ? string().notRequired()
    : string().required();
  const filename = photoRequired ? string().required() : string().notRequired();
  const resolutionArr = array()
    .of(number().integer().positive().required())
    .min(2)
    .max(2);
  const resolution = photoRequired
    ? resolutionArr.required()
    : resolutionArr.notRequired();

  return object({
    section: yupSchemas.refInput().defined(),
    description,
    copyright: string().nullable(),
    filename,
    resolution,
  })
    .test({
      name: 'filename_and_resolution',
      test(v) {
        if (!!v.filename && !v.resolution) {
          return this.createError({
            path: 'resolution',
            message: 'yup:mixed.required',
          });
        }
        if (!v.filename && !!v.resolution) {
          return this.createError({
            path: 'filename',
            message: 'yup:mixed.required',
          });
        }
        return true;
      },
    })
    .strict(true)
    .noUnknown();
}

export const SuggestionInputSchema: ObjectSchema<SuggestionInput> =
  makeSuggestingSchema(false);

export const PhotoSuggestionInputSchema: ObjectSchema<SuggestionInput> =
  makeSuggestingSchema(true);
