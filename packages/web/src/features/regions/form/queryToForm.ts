import { fromMarkdown } from '@whitewater-guide/md-editor';

import { QResult } from './regionForm.queue';
import { RegionFormData } from './types';

export default (result?: QResult): RegionFormData => {
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
