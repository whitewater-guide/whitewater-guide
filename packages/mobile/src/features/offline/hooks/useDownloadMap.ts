import type { Region } from '@whitewater-guide/schema';
import useAsyncFn from 'react-use/lib/useAsyncFn';

import type { OfflineProgress } from '../types';
import MapDownloader from './MapDownloader';

interface Hook {
  loading: boolean;
  error?: Error;
  download: (
    regionId: string,
    bounds: Region['bounds'],
  ) => Promise<null | Error>;
}

export default (onProgress: (p: Partial<OfflineProgress>) => void): Hook => {
  const [state, download] = useAsyncFn(
    async (regionId: string, bounds: Region['bounds']) => {
      const downloader = new MapDownloader(regionId, bounds, onProgress);
      await downloader.download();
      // useAsyncFn never throws, return result or error
      return null;
    },
    [onProgress],
  );

  return {
    error: state.error,
    loading: state.loading,
    download,
  };
};
