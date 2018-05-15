import React from 'react';
import { Loading } from '../../components';
import { PureScreen } from '../../utils/navigation';
import { RegionConsumer } from '../../ww-clients/features/regions';
import { Navigator, RegionTabs } from './RegionTabs';
import RegionTitle from './RegionTitle';
import { InnerProps, NavParams } from './types';

export class RegionScreen extends PureScreen<InnerProps, NavParams> {

  renderLoading = () => (<Loading />);

  render() {
    const { navigation } = this.props;
    return (
      <RegionConsumer>
        {(props) => {
          const { region, searchTerms } = props;
          if (region.loading || region.node === null) {
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
