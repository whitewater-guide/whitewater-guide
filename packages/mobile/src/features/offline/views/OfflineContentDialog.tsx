import React from 'react';

import { useOfflineContent } from '../OfflineContentProvider';
import LazyOfflineContentDialogView from './LazyOfflineContentDialogView';

export const OfflineContentDialog: React.FC = () => {
  const {
    dialogRegion,
    progress,
    regionInProgress,
    error,
  } = useOfflineContent();

  if (!dialogRegion) {
    return null;
  }

  return (
    <LazyOfflineContentDialogView
      region={dialogRegion}
      inProgress={!!regionInProgress}
      progress={progress}
      error={error}
    />
  );
};
