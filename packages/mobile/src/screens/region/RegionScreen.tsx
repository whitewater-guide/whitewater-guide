import { RegionConsumer } from '@whitewater-guide/clients';
import React from 'react';
import { WithNetworkError } from '../../components';
import { PureScreen } from '../../utils/navigation';
import HeaderRight from './HeaderRight';
import { Navigator, RegionTabs } from './RegionTabs';
import RegionTitle from './RegionTitle';
import { InnerProps, NavParams } from './types';

export class RegionScreen extends PureScreen<InnerProps, NavParams> {
  render() {
    const { navigation } = this.props;
    return (
      <RegionConsumer>
        {(props) => {
          const { region, searchTerms } = props;
          const { node, error, loading, refetch } = region;
          return (
            <WithNetworkError
              data={node}
              loading={loading}
              error={error}
              refetch={refetch}
            >
              <RegionTabs
                navigation={navigation}
                region={region}
                searchTerms={searchTerms}
              />
            </WithNetworkError>
          );
        }}
      </RegionConsumer>
    );
  }
}

(RegionScreen as any).router = Navigator.router;

RegionScreen.navigationOptions = ({ navigation }) => ({
  headerTitle: <RegionTitle regionId={navigation.getParam('regionId')} />,
  headerRight: <HeaderRight navigation={navigation} />,
});
