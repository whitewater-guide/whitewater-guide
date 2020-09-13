import { MediaInput, MediaKind } from '@whitewater-guide/commons';
import qs from 'qs';
import { RouteComponentProps } from 'react-router';

import { QResult } from './mediaForm.query';
import { RouterParams } from './types';

export default (route: RouteComponentProps<RouterParams>) => (
  result: QResult,
): MediaInput => {
  const { location } = route;
  if (!result || !result.media) {
    return {
      id: null,
      description: null,
      copyright: null,
      url: '',
      kind:
        (qs.parse(location.search.substr(1)).kind as any) || MediaKind.photo,
      resolution: null,
      weight: null,
    };
  }
  return result.media;
};
