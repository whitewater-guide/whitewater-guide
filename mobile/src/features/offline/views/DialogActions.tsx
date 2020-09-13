import React from 'react';

import { OfflineCategorySelection } from '../types';
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
      <React.Fragment>
        <CancelButton />
        <DownloadButton
          canDownload={canDownload}
          regionId={regionId}
          selection={selection}
        />
      </React.Fragment>
    );
  }
  return <BackgroundButton />;
};

export default DialogActions;
