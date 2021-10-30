import {
  SectionsStatus,
  useRegionQuery,
  useSectionsList,
} from '@whitewater-guide/clients';
import React, { FC, useCallback } from 'react';

import { Screen } from '~/components/Screen';
import WithQueryError from '~/components/WithQueryError';

const RegionTabsScreen: FC = ({ children }) => {
  const regionQuery = useRegionQuery();
  const sectionsList = useSectionsList();

  const refetchRegion = regionQuery.refetch;
  const refetchSections = sectionsList.refresh;
  const refetchBoth = useCallback(() => {
    refetchRegion();
    refetchSections();
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
          {children}
        </WithQueryError>
      </WithQueryError>
    </Screen>
  );
};

export default RegionTabsScreen;
