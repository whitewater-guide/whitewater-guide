import type { AdministrateRegionMutationVariables } from './administrateRegion.generated';
import type { RegionAdminFormData } from './types';

export default (
  settings: RegionAdminFormData,
): AdministrateRegionMutationVariables => {
  const { coverImage, ...rest } = settings;
  return {
    settings: {
      ...rest,
      coverImage: {
        mobile: coverImage ? coverImage.url ?? null : null,
      },
    },
  };
};
