import { MediaInput } from '@whitewater-guide/schema';
import { RouteComponentProps } from 'react-router';

import { RouterParams } from './types';
import { UpsertMediaMutationVariables } from './upsertMedia.generated';

export default (route: RouteComponentProps<RouterParams>) =>
  (media: MediaInput): UpsertMediaMutationVariables => ({
    sectionId: route.match.params.sectionId,
    media,
  });
