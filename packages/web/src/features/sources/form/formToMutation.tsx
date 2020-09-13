import { toMarkdown } from '@whitewater-guide/md-editor';

import { toJSON } from '../../../formik/utils';
import { SourceFormData } from './types';
import { MVars } from './upsertSource.mutation';

export default (source: SourceFormData): MVars => ({
  source: {
    ...source,
    termsOfUse: toMarkdown(source.termsOfUse),
    script: source.script.id,
    requestParams: toJSON(source.requestParams),
  },
});
