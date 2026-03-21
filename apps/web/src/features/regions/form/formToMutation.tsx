import { toMarkdown } from '@whitewater-guide/md-editor';

import type { RegionFormData } from './types';
import type { UpsertRegionMutationVariables } from './upsertRegion.generated';

export default (region: RegionFormData): UpsertRegionMutationVariables => ({
  region: {
    ...region,
    description: toMarkdown(region.description),
  },
});
