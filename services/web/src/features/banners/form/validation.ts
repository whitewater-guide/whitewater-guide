import { BannerInputSchema, yupTypes } from '@whitewater-guide/commons';
import * as yup from 'yup';
import { BannerFormData } from './types';

export const BannerFormSchema: yup.Schema<
  BannerFormData
> = BannerInputSchema.clone().shape({
  extras: yupTypes.jsonString().nullable(),
  regions: yup.array().of(yupTypes.namedNode()),
  groups: yup.array().of(yupTypes.namedNode()),
});
