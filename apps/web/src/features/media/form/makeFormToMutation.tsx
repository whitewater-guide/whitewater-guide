import type { MediaInput } from '@whitewater-guide/schema';
import type { RouteComponentProps } from 'react-router';

import type { RouterParams } from './types';
import type { UpsertMediaMutationVariables } from './upsertMedia.generated';

export default (route: RouteComponentProps<RouterParams>) =>
  (media: MediaInput): UpsertMediaMutationVariables => ({
    sectionId: route.match.params.sectionId,
    media,
  });
