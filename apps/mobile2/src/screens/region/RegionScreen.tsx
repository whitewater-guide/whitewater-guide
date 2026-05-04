import { useApolloClient } from '@apollo/client';
import { useNetInfo } from '@react-native-community/netinfo';
import {
  RegionProvider,
  SectionsFilterProvider,
  SectionsListProvider,
  useSectionsFilterOptions,
} from '@whitewater-guide/clients';
import { Dimensions, PixelRatio } from 'react-native';

import type { RegionScreenProps } from './navigation-types';
import RegionStack from './RegionStack';

const { width: screenWidth } = Dimensions.get('window');
const bannerWidth = Math.round(screenWidth * PixelRatio.get());

// Load smaller batch first to display sections asap
const limitFn = (offset: number) => (offset ? 60 : 120);

function InnerRegionScreen({ regionId }: { regionId: string }) {
  const filterOptions = useSectionsFilterOptions();
  const { isInternetReachable } = useNetInfo();
  const client = useApolloClient();
  return (
    <SectionsListProvider
      regionId={regionId}
      filterOptions={filterOptions}
      isConnected={isInternetReachable}
      client={client}
      limit={limitFn}
    >
      <RegionStack />
    </SectionsListProvider>
  );
}

function RegionScreen({ route }: RegionScreenProps) {
  const { regionId } = route.params;
  return (
    <SectionsFilterProvider>
      <RegionProvider regionId={regionId} bannerWidth={bannerWidth}>
        <InnerRegionScreen regionId={regionId} />
      </RegionProvider>
    </SectionsFilterProvider>
  );
}

export default RegionScreen;
