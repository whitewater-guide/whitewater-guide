import { toMarkdown } from '@whitewater-guide/md-editor';

import { toJSON } from '../../../formik/utils';
import type { SourceFormData } from './types';
import type { UpsertSourceMutationVariables } from './upsertSource.generated';

export default (source: SourceFormData): UpsertSourceMutationVariables => ({
  source: {
    ...source,
    termsOfUse: toMarkdown(source.termsOfUse),
    script: source.script.id,
    requestParams: toJSON(source.requestParams),
  },
});
