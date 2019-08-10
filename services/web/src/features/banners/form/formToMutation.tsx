import { toJSON } from '../../../formik/utils';
import { BannerFormData } from './types';
import { MVars } from './upsertBanner.mutation';

export default (banner: BannerFormData): MVars => ({
  banner: {
    ...banner,
    extras: toJSON(banner.extras),
  },
});
