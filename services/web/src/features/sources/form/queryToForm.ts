import { HarvestMode } from '@whitewater-guide/commons';
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
        error: null,
        harvestMode: HarvestMode.ONE_BY_ONE,
      },
      cron: null,
      requestParams: null,
      harvestMode: HarvestMode.ONE_BY_ONE,
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
      harvestMode: src.harvestMode,
      error: null,
    },
    requestParams: fromJSON(src.requestParams),
    regions: squashConnection(src, 'regions'),
  };
};
