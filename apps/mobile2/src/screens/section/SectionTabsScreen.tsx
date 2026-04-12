import { useRegionQuery, useSectionQuery } from '@whitewater-guide/clients';
import type { FC, PropsWithChildren } from 'react';
import { useCallback } from 'react';

import Screen from '../../components/Screen';
import WithQueryError from '../../components/WithQueryError';

const SectionTabsScreen: FC<PropsWithChildren> = ({ children }) => {
  const sectionQuery = useSectionQuery();
  const regionQuery = useRegionQuery();

  const refetchSection = sectionQuery.refetch;
  const refetchRegion = regionQuery.refetch;
  const refetchBoth = useCallback(() => {
    void refetchSection();
    void refetchRegion();
  }, [refetchRegion, refetchSection]);

  return (
    <Screen>
      <WithQueryError
        hasData={!!sectionQuery.data?.section?.region?.id}
        error={sectionQuery.error}
        loading={sectionQuery.loading}
        refetch={refetchBoth}
      >
        <WithQueryError
          hasData={!!regionQuery.data?.region}
          error={regionQuery.error}
          loading={regionQuery.loading}
          refetch={refetchBoth}
        >
          {children}
        </WithQueryError>
      </WithQueryError>
    </Screen>
  );
};

export default SectionTabsScreen;
