import { RegionProvider } from '@whitewater-guide/clients';
import React from 'react';
import { NavigationRouter, NavigationScreenComponent } from 'react-navigation';
import { WithNetworkError } from '../../components';
import theme from '../../theme';
import HeaderRight from './HeaderRight';
import { Navigator, RegionTabs } from './RegionTabs';
import RegionTitle from './RegionTitle';
import { NavParams } from './types';

export const RegionScreen: NavigationScreenComponent<NavParams> & {
  router: NavigationRouter;
} = ({ navigation }) => {
  return (
    <RegionProvider
      regionId={navigation.getParam('regionId')}
      bannerWidth={theme.screenWidthPx}
    >
      {(region) => {
        const { node, error, loading, refetch } = region;
        return (
          <WithNetworkError
            data={node}
            loading={loading}
            error={error}
            refetch={refetch}
          >
            <RegionTabs navigation={navigation} region={region} />
          </WithNetworkError>
        );
      }}
    </RegionProvider>
  );
};

RegionScreen.router = Navigator.router;

RegionScreen.navigationOptions = ({ navigation }) => ({
  headerTitle: <RegionTitle regionId={navigation.getParam('regionId')} />,
  headerRight: <HeaderRight navigation={navigation} />,
});
