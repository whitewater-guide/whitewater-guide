import analytics from '@react-native-firebase/analytics';
import { useCallback, useEffect, useState } from 'react';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import { OfflineCategorySelection, OfflineProgress } from '../types';
import { PhotoChannel } from '../utils';
import useDownloadMap from './useDownloadMap';
import useDownloadPhotos from './useDownloadPhotos';
import useDownloadRegionData from './useDownloadRegionData';
import useDownloadSections from './useDownloadSections';
import useMediaSummary from './useMediaSummary';

interface Hook {
  download: (selection: OfflineCategorySelection) => Promise<null | Error>;
  error?: Error;
  loading: boolean;
  progress: OfflineProgress;
}

export const useDownloadRegion = (regionId: string | null): Hook => {
  // Media summary is read from cache, because it's displayed in dialog before actual download begins
  const getMediaSummary = useMediaSummary();
  const downloadRegionData = useDownloadRegionData(regionId);
  const [progress, setProgress] = useState<OfflineProgress>({});
  const onProgress = useCallback(
    (p: Partial<OfflineProgress>) => {
      setProgress((pr) => ({ ...pr, ...p }));
    },
    [setProgress],
  );
  const photos = useDownloadPhotos(onProgress);
  const sections = useDownloadSections(onProgress);
  const maps = useDownloadMap(onProgress);

  useEffect(() => {
    setProgress({});
  }, [regionId, setProgress]);

  const [state, download] = useAsyncFn(
    async (selection: OfflineCategorySelection) => {
      if (!regionId) {
        return null;
      }
      analytics().logEvent('offline_download_started', { region: regionId });
      const { data } = await downloadRegionData();
      if (!data || !data.region) {
        throw new Error('failed to download region data');
      }
      const estimated = getMediaSummary(regionId);
      const channel = new PhotoChannel();
      const promises: Array<Promise<any>> = [
        sections.download(regionId, estimated.sections, channel),
      ];
      const initialProgress: OfflineProgress = {
        data: [0, estimated.sections],
      };

      if (selection.media) {
        promises.push(photos.download(estimated.photos, channel));
        initialProgress.media = [0, estimated.photos];
      }
      if (selection.maps) {
        promises.push(maps.download(regionId, data.region.bounds));
        initialProgress.maps = [0, 100];
      }
      setProgress(initialProgress);
      const errors = await Promise.all(promises);
      const err = errors.reduce((acc, e) => acc || e, null);
      if (!err) {
        analytics().logEvent('offline_download_complete', { region: regionId });
        return null;
      } else {
        throw err;
      }
    },
    [
      regionId,
      getMediaSummary,
      sections,
      maps,
      photos,
      downloadRegionData,
      setProgress,
    ],
  );

  return {
    download,
    progress,
    error: state.error,
    loading: state.loading,
  };
};
