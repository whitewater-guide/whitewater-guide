import { getLocalPhotoSchema } from '@whitewater-guide/clients';
import {
  BannerInputSchema,
  BannerResolutions,
  yupTypes,
} from '@whitewater-guide/commons';
import * as yup from 'yup';
import { BannerFormData } from './types';

const ImageSourceSchema = yup.object().test({
  name: 'is-correct-image-banner-source',
  message: 'web:banners.invalidSource',
  test(v: any) {
    const placement = (this.options.context as any).placement;
    const resolution = BannerResolutions.get(placement);
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

const WebViewSourceSchema = yup
  .string()
  .url()
  .required();

export const BannerFormSchema: yup.Schema<
  BannerFormData
> = BannerInputSchema.clone().shape({
  extras: yupTypes.jsonString().nullable(),
  regions: yup.array().of(yupTypes.namedNode()),
  groups: yup.array().of(yupTypes.namedNode()),
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
});
