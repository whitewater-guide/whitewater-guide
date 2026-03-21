import { useRegionQuery, useSectionQuery } from '@whitewater-guide/clients';
import type { FC, PropsWithChildren } from 'react';
import React, { useCallback } from 'react';

import { Screen } from '~/components/Screen';
import WithQueryError from '~/components/WithQueryError';

const SectionTabsScreen: FC<PropsWithChildren> = ({ children }) => {
  const regionQuery = useRegionQuery();
  const sectionQuery = useSectionQuery();

  const refetchRegion = regionQuery.refetch;
  const refetchSection = sectionQuery.refetch;
  const refetchBoth = useCallback(() => {
    refetchSection();
    refetchRegion();
  }, [refetchRegion, refetchSection]);

  return (
    <Screen>
      <WithQueryError
        hasData={!!sectionQuery.data?.section?.region?.id}
        error={sectionQuery.error}
        loading={sectionQuery.loading}
        refetch={refetchBoth}
        testID="with-section-error"
      >
        <WithQueryError
          hasData={!!regionQuery.data?.region}
          error={regionQuery.error}
          loading={regionQuery.loading}
          refetch={refetchBoth}
          testID="with-region-error"
        >
          {children}
        </WithQueryError>
      </WithQueryError>
    </Screen>
  );
};

export default SectionTabsScreen;
