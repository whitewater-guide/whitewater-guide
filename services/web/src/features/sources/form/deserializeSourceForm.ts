import { Source } from '@whitewater-guide/commons';
import { deserializeForm } from '../../../components/forms';
import { SourceFormData } from './types';

const deserializeSourceForm = (data: Source): SourceFormData => {
  const result = deserializeForm(['termsOfUse'], [], ['regions'])(data);
  return {
    ...result,
    script: {
      id: data.script,
      name: data.script,
      harvestMode: data.harvestMode,
    },
  } as any;
};

export default deserializeSourceForm;
