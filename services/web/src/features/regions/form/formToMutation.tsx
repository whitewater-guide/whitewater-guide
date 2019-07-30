import { toMarkdown } from '@whitewater-guide/md-editor';
import { RegionFormData } from './types';
import { MVars } from './upsertRegion.mutation';

export default (region: RegionFormData): MVars => ({
  region: {
    ...region,
    description: toMarkdown(region.description),
  },
});
