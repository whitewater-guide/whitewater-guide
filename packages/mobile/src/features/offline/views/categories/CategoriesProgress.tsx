import { RegionMediaSummary } from '@whitewater-guide/commons';
import React from 'react';

import { OfflineProgress } from '../../types';
import OfflineCategoryProgress from './OfflineCategoryProgress';
import useLabels from './useLabels';

interface Props {
  summary: RegionMediaSummary;
  progress: OfflineProgress;
}

const CategoriesProgress: React.FC<Props> = (props) => {
  const { summary, progress } = props;
  const labels = useLabels(summary);
  return (
    <React.Fragment>
      <OfflineCategoryProgress label={labels.data} progress={progress.data} />
      <OfflineCategoryProgress label={labels.media} progress={progress.media} />
      <OfflineCategoryProgress label={labels.maps} progress={progress.maps} />
    </React.Fragment>
  );
};

export default CategoriesProgress;
