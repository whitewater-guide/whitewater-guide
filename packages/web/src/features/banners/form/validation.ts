import {
  BannerResolutions,
  getLocalPhotoSchema,
} from '@whitewater-guide/clients';
import { BannerInputSchema, BannerPlacement } from '@whitewater-guide/schema';
import { yupSchemas } from '@whitewater-guide/validation';
import * as yup from 'yup';

import { BannerFormData } from './types';

const ImageSourceSchema = yup.object().test({
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
        message: (e as yup.ValidationError).message,
      });
    }
  },
});

const WebViewSourceSchema = yup.string().url().required();

export const BannerFormSchema: yup.SchemaOf<BannerFormData> =
  BannerInputSchema.clone()
    .shape({
      extras: yup.string().jsonString().nullable(),
      regions: yup.array().of(yupSchemas.refInput()),
      groups: yup.array().of(yupSchemas.refInput()),
      source: yup.mixed().test({
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
              message: (e as yup.ValidationError).message,
            });
          }
        },
      }),
    })
    .defined();
