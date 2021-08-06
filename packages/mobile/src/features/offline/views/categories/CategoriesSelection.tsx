import { RegionMediaSummary } from '@whitewater-guide/schema';
import React from 'react';

import { OfflineCategorySelection, OfflineCategoryType } from '../../types';
import OfflineCategory from './OfflineCategory';
import OfflineCategoryMaps from './OfflineCategoryMaps';
import useLabels from './useLabels';

interface Props {
  summary: RegionMediaSummary;
  selection: OfflineCategorySelection;
  onToggleCategory?: (type: OfflineCategoryType, value: boolean) => void;
}

const CategoriesSelection: React.FC<Props> = (props) => {
  const { summary, selection, onToggleCategory } = props;
  const labels = useLabels(summary);

  return (
    <>
      <OfflineCategory
        type="data"
        label={labels.data}
        selected={selection.data}
        disabled
        onToggle={onToggleCategory}
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
