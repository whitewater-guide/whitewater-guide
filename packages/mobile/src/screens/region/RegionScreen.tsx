import { useNetInfo } from '@react-native-community/netinfo';
import {
  RegionProvider,
  SectionsFilterProvider,
  SectionsListProvider,
  useSectionsFilterOptions,
} from '@whitewater-guide/clients';
import React from 'react';
import { useApolloClient } from 'react-apollo';

import ErrorBoundary from '~/components/ErrorBoundary';
import theme from '~/theme';

import RegionStack from './RegionStack';
import { RegionScreenNavProps } from './types';

// Load smaller batch first to display asap
const limitFn = (offset: number) => (offset ? 60 : 20);

interface Props {
  regionId: string;
}

const InnerRegionScreen: React.FC<Props> = ({ regionId }) => {
  const filterOptions = useSectionsFilterOptions();
  const { isConnected } = useNetInfo();
  const client = useApolloClient();
  return (
    <SectionsListProvider
      filterOptions={filterOptions}
      regionId={regionId}
      isConnected={isConnected}
      client={client}
      limit={limitFn}
    >
      <RegionStack />
    </SectionsListProvider>
  );
};

const RegionScreen: React.FC<RegionScreenNavProps> = ({ route }) => {
  // TODO navigation allow error boundary to reset to home screen
  return (
    <ErrorBoundary>
      <SectionsFilterProvider>
        <RegionProvider
          regionId={route.params.regionId}
          bannerWidth={theme.screenWidthPx}
        >
          <InnerRegionScreen regionId={route.params.regionId} />
        </RegionProvider>
      </SectionsFilterProvider>
    </ErrorBoundary>
  );
};

export default RegionScreen;
