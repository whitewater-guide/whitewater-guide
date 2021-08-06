import { MediaInput, MediaKind } from '@whitewater-guide/schema';
import qs from 'qs';
import { RouteComponentProps } from 'react-router';

import { MediaFormQuery } from './mediaForm.generated';
import { RouterParams } from './types';

export default (route: RouteComponentProps<RouterParams>) =>
  (result: MediaFormQuery): MediaInput => {
    const { location } = route;
    if (!result || !result.media) {
      return {
        id: null,
        description: null,
        copyright: null,
        url: '',
        kind:
          (qs.parse(location.search.substr(1)).kind as any) || MediaKind.Photo,
        resolution: null,
        weight: null,
        license: null,
      };
    }
    return result.media;
  };
