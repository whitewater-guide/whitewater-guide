import {
  SectionsStatus,
  useRegionQuery,
  useSectionsList,
} from '@whitewater-guide/clients';
import type { FC, PropsWithChildren } from 'react';
import { useCallback } from 'react';

import { Screen } from '~/components/Screen';
import WithQueryError from '~/components/WithQueryError';

const RegionTabsScreen: FC<PropsWithChildren> = ({ children }) => {
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
