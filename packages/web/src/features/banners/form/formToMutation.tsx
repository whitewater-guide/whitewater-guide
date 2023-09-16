import { BannerKind } from '@whitewater-guide/schema';

import { toJSON } from '../../../formik/utils';
import type { BannerFormData } from './types';
import type { UpsertBannerMutationVariables } from './upsertBanner.generated';

export default (banner: BannerFormData): UpsertBannerMutationVariables => {
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
