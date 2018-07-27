import { FieldResolvers } from '@apollo';
import { RegionCoverImage } from '@ww-commons';

export const coverImageResolvers: FieldResolvers<any, RegionCoverImage> = {
  mobile: (coverImageRaw) => {
    const mobile = coverImageRaw ? coverImageRaw.mobile : null;
    return mobile || null;
  },
};
