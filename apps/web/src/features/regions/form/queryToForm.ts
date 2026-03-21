import { fromMarkdown } from '@whitewater-guide/md-editor';

import type { RegionFormQuery } from './regionForm.generated';
import type { RegionFormData } from './types';

export default (result?: RegionFormQuery): RegionFormData => {
  if (!result || !result.region) {
    return {
      id: null,
      description: fromMarkdown(null),
      bounds: [],
      seasonNumeric: [],
      season: null,
      name: '',
      pois: [],
      license: null,
      copyright: null,
    };
  }
  return {
    ...result.region,
    description: fromMarkdown(result.region.description),
  };
};
