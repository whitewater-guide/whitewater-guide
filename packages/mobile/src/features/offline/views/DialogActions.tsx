import React from 'react';
import { OfflineCategorySelection } from '../types';
import BackgroundButton from './BackgroundButton';
import DownloadButton from './DownloadButton';

interface Props {
  canDownload: boolean;
  selection: OfflineCategorySelection;
  regionId: string;
  inProgress?: boolean;
}

const DialogActions: React.FC<Props> = (props) => {
  const { inProgress, ...rest } = props;
  if (inProgress) {
    return <BackgroundButton />;
  }
  return <DownloadButton {...rest} />;
};

export default DialogActions;
