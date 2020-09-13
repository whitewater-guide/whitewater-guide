import { MediaInput } from '@whitewater-guide/commons';
import { RouteComponentProps } from 'react-router';

import { RouterParams } from './types';
import { MVars } from './upsertMedia.mutation';

export default (route: RouteComponentProps<RouterParams>) => (
  media: MediaInput,
): MVars => ({
  sectionId: route.match.params.sectionId,
  media,
});
