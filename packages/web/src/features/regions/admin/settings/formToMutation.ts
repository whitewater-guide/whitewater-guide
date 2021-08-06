import { AdministrateRegionMutationVariables } from './administrateRegion.generated';
import { RegionAdminFormData } from './types';

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
