import { fromMarkdown } from '@whitewater-guide/md-editor';

import { fromJSON, squashConnection } from '../../../formik/utils';
import { QResult } from './sourceForm.query';
import { SourceFormData } from './types';

export default (result?: QResult): SourceFormData => {
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
    regions: squashConnection(src, 'regions'),
  };
};
