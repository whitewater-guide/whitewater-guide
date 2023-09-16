import useAsyncFn from 'react-use/lib/useAsyncFn';

import type { OfflineProgress } from '../types';
import type { PhotoChannel } from '../utils';
import { PhotoDownloader } from './PhotoDownloader';

interface Hook {
  loading: boolean;
  error?: Error;
  download: (
    estimatedTotal: number,
    photoChannel: PhotoChannel,
  ) => Promise<null | Error>;
}

export default (onProgress: (p: Partial<OfflineProgress>) => void): Hook => {
  const [state, download] = useAsyncFn(
    async (estimTotal: number, channel: PhotoChannel) => {
      const downloader = new PhotoDownloader(estimTotal, onProgress);
      await downloader.download(channel);
      // useAsyncFn never throws, return result or error
      return null;
    },
    [onProgress],
  );

  return {
    loading: state.loading,
    error: state.error,
    download,
  };
};
