import {
  BannerResolutions,
  getLocalPhotoSchema,
} from '@whitewater-guide/clients';
import type { BannerPlacement } from '@whitewater-guide/schema';
import { BannerInputSchema } from '@whitewater-guide/schema';
import { yupSchemas } from '@whitewater-guide/validation';
import type { ObjectSchema, ValidationError } from 'yup';
import { array, mixed, object, string } from 'yup';

import type { LocalPhoto } from '../../../utils/files';
import type { BannerFormData } from './types';

const ImageSourceSchema = object().test({
  name: 'is-correct-image-banner-source',
  message: 'web:banners.invalidSource',
  test(v: any) {
    const placement = (this.options.context as any)
      .placement as BannerPlacement;
    const resolution = BannerResolutions[placement];
    const localPhotoSchema = getLocalPhotoSchema({
      mpxOrResolution: resolution,
    });
    try {
      localPhotoSchema.validateSync(v);
      return true;
    } catch (e) {
      return this.createError({
        message: (e as ValidationError).message,
      });
    }
  },
});

const WebViewSourceSchema = string().url().required();

export const BannerFormSchema: ObjectSchema<BannerFormData> =
  BannerInputSchema.clone()
    .shape({
      extras: string().jsonString().required().nullable(),
      regions: array().of(yupSchemas.refInput()).required(),
      groups: array().of(yupSchemas.refInput()).required(),
      source: mixed<string | LocalPhoto>()
        .required()
        .test({
          name: 'banner-source',
          message: 'web:banners.invalidSource',
          test(v: any) {
            const schema =
              typeof v === 'string' ? WebViewSourceSchema : ImageSourceSchema;
            try {
              schema.validateSync(v, { context: this.parent });
              return true;
            } catch (e) {
              return this.createError({
                message: (e as ValidationError).message,
              });
            }
          },
        }),
    })
    .defined();
