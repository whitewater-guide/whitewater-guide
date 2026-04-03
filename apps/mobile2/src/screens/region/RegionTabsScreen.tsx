import {
  SectionsStatus,
  useRegionQuery,
  useSectionsList,
} from '@whitewater-guide/clients';
import { useCallback } from 'react';

import Screen from '../../components/Screen';
import WithQueryError from '../../components/WithQueryError';
import RegionTabs from './RegionTabs';

function RegionTabsScreen() {
  const regionQuery = useRegionQuery();
  const sectionsList = useSectionsList();

  const refetchRegion = regionQuery.refetch;
  const refetchSections = sectionsList.refresh;
  const refetchBoth = useCallback(() => {
    void refetchRegion();
    void refetchSections();
  }, [refetchRegion, refetchSections]);

  return (
    <Screen>
      <WithQueryError
        hasData={!!regionQuery.data?.region}
        error={regionQuery.error}
        loading={regionQuery.loading}
        refetch={refetchBoth}
      >
        <WithQueryError
          hasData={!!sectionsList.sections}
          error={sectionsList.error}
          loading={sectionsList.status === SectionsStatus.LOADING}
          refetch={refetchBoth}
        >
          <RegionTabs />
        </WithQueryError>
      </WithQueryError>
    </Screen>
  );
}

export default RegionTabsScreen;
