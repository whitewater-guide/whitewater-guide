import { FieldResolvers } from '@apollo';
import { RegionCoverImage } from '@whitewater-guide/commons';

export const coverImageResolvers: FieldResolvers<any, RegionCoverImage> = {
  mobile: (coverImageRaw) => {
    const mobile = coverImageRaw ? coverImageRaw.mobile : null;
    return mobile || null;
  },
};
