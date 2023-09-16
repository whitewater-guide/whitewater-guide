import { useApolloClient } from '@apollo/client';
import type { DocumentNode } from 'graphql';
import useAsyncFn from 'react-use/lib/useAsyncFn';

import type { OfflineProgress } from '../types';
import type { PhotoChannel } from '../utils';
import { SectionsDownloader } from './SectionsDownloader';

interface Options {
  limit?: number;
  query?: DocumentNode;
}

interface Hook {
  loading: boolean;
  error?: Error;
  download: (
    regionId: string,
    estimatedTotal: number,
    photoChannel: PhotoChannel,
  ) => Promise<null | Error>;
}

export default (
  onProgress: (p: Partial<OfflineProgress>) => void,
  opts: Options = {},
): Hook => {
  const apollo = useApolloClient();

  const [state, download] = useAsyncFn(
    async (
      regionId: string,
      estimatedTotal: number,
      photoChannel: PhotoChannel,
    ) => {
      const downloader = new SectionsDownloader({
        apollo,
        photoChannel,
        onProgress,
        ...opts,
      });
      await downloader.download(regionId, estimatedTotal);
      // useAsyncFn never throws, return result or error
      return null;
    },
    [apollo, onProgress, opts],
  );

  return {
    loading: state.loading,
    error: state.error,
    download,
  };
};
