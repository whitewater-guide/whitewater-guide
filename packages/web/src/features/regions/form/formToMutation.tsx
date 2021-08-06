import { toMarkdown } from '@whitewater-guide/md-editor';

import { RegionFormData } from './types';
import { UpsertRegionMutationVariables } from './upsertRegion.generated';

export default (region: RegionFormData): UpsertRegionMutationVariables => ({
  region: {
    ...region,
    description: toMarkdown(region.description),
  },
});
