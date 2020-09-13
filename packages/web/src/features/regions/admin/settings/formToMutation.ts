import { MVars } from './administrateRegion.mutation';
import { RegionAdminFormData } from './types';

export default (settings: RegionAdminFormData): MVars => {
  const { coverImage, ...rest } = settings;
  return {
    settings: {
      ...rest,
      coverImage: {
        mobile: coverImage ? coverImage.url! : null,
      },
    },
  };
};
