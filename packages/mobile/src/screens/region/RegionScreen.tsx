import React from 'react';
import { Loading } from '../../components';
import { PureScreen } from '../../utils/navigation';
import { RegionProvider } from '../../ww-clients/features/regions';
import { Navigator, RegionTabs } from './RegionTabs';
import RegionTitle from './RegionTitle';
import { InnerProps, NavParams } from './types';

export class RegionScreen extends PureScreen<InnerProps, NavParams> {

  renderLoading = () => (<Loading />);

  render() {
    const { navigation } = this.props;
    return (
      <RegionProvider regionId={navigation.getParam('regionId')} renderLoading={this.renderLoading}>
        <RegionTabs navigation={navigation} />
      </RegionProvider>
    );
  }
}

(RegionScreen as any).router = Navigator.router;

RegionScreen.navigationOptions = ({ navigation }) => ({
  headerTitle: <RegionTitle regionId={navigation.getParam('regionId')}/>,
});
