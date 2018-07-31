import React from 'react';
import { Loading, RetryPlaceholder } from '../../components';
import isApolloOfflineError from '../../utils/isApolloOfflineError';
import { PureScreen } from '../../utils/navigation';
import { RegionConsumer } from '../../ww-clients/features/regions';
import { Navigator, RegionTabs } from './RegionTabs';
import RegionTitle from './RegionTitle';
import { InnerProps, NavParams } from './types';

interface State {
  refetchingFromError: boolean;
}

export class RegionScreen extends PureScreen<InnerProps, NavParams, State> {

  renderLoading = () => (<Loading />);

  render() {
    const { navigation } = this.props;
    return (
      <RegionConsumer>
        {(props) => {
          const { region, searchTerms } = props;
          if (isApolloOfflineError(region.error, region.node)) {
            return (
              <RetryPlaceholder refetch={region.refetch} />
            );
          }
          if (region.loading && !region.node) {
            return (<Loading />);
          }
          return (
            <RegionTabs navigation={navigation} region={region} searchTerms={searchTerms} />
          );
        }}
      </RegionConsumer>
    );
  }
}

(RegionScreen as any).router = Navigator.router;

RegionScreen.navigationOptions = ({ navigation }) => ({
  headerTitle: <RegionTitle regionId={navigation.getParam('regionId')}/>,
});
