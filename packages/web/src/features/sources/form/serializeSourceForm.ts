import { serializeForm } from '../../../components/forms';
import { SourceInput } from '../../../ww-commons';
import { SourceFormData } from './types';

const serializeSourceForm = (data: SourceFormData): SourceInput => {
  const result = serializeForm(['termsOfUse'], [], ['regions'])(data);
  return {
    ...result,
    script: data.script.id,
    harvestMode: data.script.harvestMode,
  } as any;
};

export default serializeSourceForm;
