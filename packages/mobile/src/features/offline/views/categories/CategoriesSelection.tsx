import { RegionMediaSummary } from '@whitewater-guide/schema';
import React from 'react';

import { OfflineCategorySelection, OfflineCategoryType } from '../../types';
import OfflineCategory from './OfflineCategory';
import OfflineCategoryData from './OfflineCategoryData';
import OfflineCategoryMaps from './OfflineCategoryMaps';
import useLabels from './useLabels';

interface Props {
  regionId: string;
  summary: RegionMediaSummary;
  selection: OfflineCategorySelection;
  onToggleCategory?: (type: OfflineCategoryType, value: boolean) => void;
}

const CategoriesSelection: React.FC<Props> = (props) => {
  const { summary, selection, onToggleCategory, regionId } = props;
  const labels = useLabels(summary);

  return (
    <>
      <OfflineCategoryData
        type="data"
        label={labels.data}
        selected={selection.data}
        disabled
        onToggle={onToggleCategory}
        regionId={regionId}
      />
      <OfflineCategory
        type="media"
        label={labels.media}
        selected={selection.media}
        onToggle={onToggleCategory}
      />
      <OfflineCategoryMaps
        type="maps"
        label={labels.maps}
        selected={selection.maps}
        onToggle={onToggleCategory}
      />
    </>
  );
};

export default CategoriesSelection;
