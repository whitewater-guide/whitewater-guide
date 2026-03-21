import { fromMarkdown } from '@whitewater-guide/md-editor';

import { fromJSON } from '../../../formik/utils';
import type { SourceFormQuery } from './sourceForm.generated';
import type { SourceFormData } from './types';

export default (result?: SourceFormQuery): SourceFormData => {
  if (!result || !result.source) {
    return {
      id: null,
      name: '',
      termsOfUse: fromMarkdown(null),
      script: {
        id: 'one_by_one',
        name: 'one_by_one',
      },
      cron: null,
      requestParams: null,
      url: null,
      regions: [],
    };
  }
  const src = result.source;
  return {
    ...src,
    termsOfUse: fromMarkdown(src.termsOfUse),
    script: {
      id: src.script,
      name: src.script,
    },
    requestParams: fromJSON(src.requestParams),
    regions: src.regions.nodes ?? [],
  };
};
