import { SourceInput } from '@whitewater-guide/commons';
import { serializeForm } from '../../../components/forms';
import { SourceFormData } from './types';

const serializeSourceForm = (data: SourceFormData): SourceInput => {
  const result = serializeForm(['termsOfUse'], [], ['regions'])(data);
  const requestParams =
    result && result.requestParams ? JSON.parse(result.requestParams) : null;
  return {
    ...result,
    requestParams,
    script: data.script.id,
    harvestMode: data.script.harvestMode,
  } as any;
};

export default serializeSourceForm;
