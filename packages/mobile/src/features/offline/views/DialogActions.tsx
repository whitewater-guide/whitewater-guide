import React from 'react';

import type { OfflineCategorySelection } from '../types';
import BackgroundButton from './BackgroundButton';
import CancelButton from './CancelButton';
import DownloadButton from './DownloadButton';

interface Props {
  canDownload: boolean;
  selection: OfflineCategorySelection;
  regionId: string;
  inProgress?: boolean;
  error?: Error;
}

const DialogActions: React.FC<Props> = (props) => {
  const { inProgress, canDownload, selection, regionId, error } = props;
  if (error || !inProgress) {
    return (
      <>
        <CancelButton />
        <DownloadButton
          canDownload={canDownload}
          regionId={regionId}
          selection={selection}
        />
      </>
    );
  }
  return <BackgroundButton />;
};

export default DialogActions;
