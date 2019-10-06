import {
  MapSelectionProvider,
  useRegion,
  useSectionsList,
} from '@whitewater-guide/clients';
import { SelectedPOIView, SelectedSectionView } from 'components/map';
import WithNetworkError from 'components/WithNetworkError';
import React from 'react';
import AddSectionFAB from './AddSectionFAB';
import SectionsProgress from './SectionsProgress';

const LazyRegionTabs: React.FC = ({ children }) => {
  const sectionsList = useSectionsList();
  const { error, loading, node, refetch } = useRegion();
  return (
    <MapSelectionProvider>
      <WithNetworkError
        data={node}
        loading={loading}
        error={error}
        refetch={refetch}
      >
        {children}
        <AddSectionFAB />
        <SelectedPOIView />
        <SelectedSectionView />
        <SectionsProgress
          status={sectionsList.status}
          loaded={sectionsList.sections.length}
          count={sectionsList.count}
        />
      </WithNetworkError>
    </MapSelectionProvider>
  );
};

LazyRegionTabs.displayName = 'LazyRegionTabs';

export default LazyRegionTabs;
