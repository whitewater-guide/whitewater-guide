import { BannerKind } from '@whitewater-guide/commons';
import { toJSON } from '../../../formik/utils';
import { BannerFormData } from './types';
import { MVars } from './upsertBanner.mutation';

export default (banner: BannerFormData): MVars => {
  const { extras, source, ...rest } = banner;
  return {
    banner: {
      ...rest,
      source: {
        kind:
          typeof source === 'string' ? BannerKind.WebView : BannerKind.Image,
        url: typeof source === 'string' ? source : source.url!,
      },
      extras: toJSON(extras),
    },
  };
};
