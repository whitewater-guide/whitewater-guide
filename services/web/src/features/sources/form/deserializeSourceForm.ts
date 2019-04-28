import { Source } from '@whitewater-guide/commons';
import { deserializeForm } from '../../../components/forms';
import { SourceFormData } from './types';

const deserializeSourceForm = (data: Source): SourceFormData => {
  const result = deserializeForm(['termsOfUse'], [], ['regions'])(data);
  const requestParams =
    result && result.requestParams
      ? JSON.stringify(result.requestParams)
      : null;
  return {
    ...result,
    requestParams,
    script: {
      id: data.script,
      name: data.script,
      harvestMode: data.harvestMode,
    },
  } as any;
};

export default deserializeSourceForm;
