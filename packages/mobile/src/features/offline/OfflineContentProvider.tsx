import { NamedNode } from '@whitewater-guide/commons';
import React, { useCallback, useContext, useState } from 'react';
import { useDownloadRegion } from './hooks';
import { OfflineCategorySelection, OfflineProgress } from './types';

interface OfflineContentCtx {
  download: (regionId: string, selection: OfflineCategorySelection) => void;
  setDialogRegion: (region: NamedNode | null) => void;
  progress: OfflineProgress;
  regionInProgress: string | null;
  dialogRegion: NamedNode | null;
  error?: Error;
}

const OfflineContentContext = React.createContext<OfflineContentCtx>({
  download: () => {},
  setDialogRegion: () => {},
  progress: {},
  regionInProgress: null,
  dialogRegion: null,
});

export const OfflineContentProvider: React.FC = ({ children }) => {
  const [dialogRegion, setDialogReg] = useState<NamedNode | null>(null);
  const [regionInProgress, setRegionInProgress] = useState<string | null>(null);

  const downloader = useDownloadRegion(
    regionInProgress || dialogRegion?.id || null,
  );
  const download = useCallback(
    (regionId: string, selection: OfflineCategorySelection) => {
      setRegionInProgress(regionId);
      downloader.download(selection).then((error) => {
        if (!error) {
          setRegionInProgress(null);
          setDialogReg(null);
        }
      });
    },
    [setRegionInProgress, setDialogReg, downloader],
  );

  const setDialogRegion = useCallback(
    (v: NamedNode | null) => {
      setDialogReg(v);
      // closing dialog which has error
      if (v === null && downloader.error) {
        setRegionInProgress(null);
      }
    },
    [setDialogReg, downloader, setRegionInProgress],
  );

  const value = {
    dialogRegion,
    regionInProgress,
    download,
    setDialogRegion,
    progress: downloader.progress,
    error: downloader.error,
  };

  return (
    <OfflineContentContext.Provider value={value}>
      {children}
    </OfflineContentContext.Provider>
  );
};

export const useOfflineContent = () => useContext(OfflineContentContext);
