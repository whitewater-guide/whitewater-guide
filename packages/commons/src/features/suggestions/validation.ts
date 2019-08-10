import * as yup from 'yup';
import { yupTypes } from '../../validation';
import { SuggestionInput } from './types';

export const SuggestionInputSchema = yup
  .object<SuggestionInput>({
    section: yupTypes.node().defined(),
    description: yup
      .string()
      .nullable(true)
      .test({
        name: 'correct-description',
        message: 'yup:mixed.required',
        test(v) {
          return !!v || !!this.parent.filename;
        },
      }),
    copyright: yup.string().nullable(true),
    filename: yup
      .string()
      .nullable(true)
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
      .of(
        yup
          .number()
          .integer()
          .positive(),
      )
      .nullable()
      .test({
        name: 'correct-resolution',
        message: 'yup:mixed.required',
        test(v) {
          return !!v ? !!this.parent.filename : !this.parent.filename;
        },
      }),
  })
  .strict(true)
  .noUnknown();
