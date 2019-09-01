import { useNetInfo } from '@react-native-community/netinfo';
import {
  RegionProvider,
  SectionsListProvider,
  useFilterState,
} from '@whitewater-guide/clients';
import React from 'react';
import { useApolloClient } from 'react-apollo';
import { NavigationRouter, NavigationScreenComponent } from 'react-navigation';
import { ErrorBoundary, WithNetworkError } from '../../components';
import theme from '../../theme';
import RegionStack from './RegionStack';

interface NavParams {
  regionId: string;
}

export const RegionScreen: NavigationScreenComponent<NavParams> & {
  router: NavigationRouter;
} = ({ navigation }) => {
  const searchTerms = useFilterState();
  const { isConnected } = useNetInfo();
  const client = useApolloClient();
  const regionId = navigation.getParam('regionId');
  return (
    <ErrorBoundary>
      <RegionProvider regionId={regionId} bannerWidth={theme.screenWidthPx}>
        {(region) => {
          const { node, error, loading, refetch } = region;
          return (
            <WithNetworkError
              data={node}
              loading={loading}
              error={error}
              refetch={refetch}
            >
              <SectionsListProvider
                searchTerms={searchTerms}
                regionId={regionId}
                isConnected={isConnected}
                client={client}
              >
                <RegionStack navigation={navigation} />
              </SectionsListProvider>
            </WithNetworkError>
          );
        }}
      </RegionProvider>
    </ErrorBoundary>
  );
};

RegionScreen.router = RegionStack.router;

RegionScreen.navigationOptions = ({ navigation }) => ({
  header: null,
});
