import React from 'react';
import { createStackNavigator, NavigationRouter, StackNavigatorConfig } from 'react-navigation';
import { Loading } from '../../components';
import { PureScreen } from '../../utils/navigation';
import { RegionProvider } from '../../ww-clients/features/regions';
import { RegionTabs } from './RegionTabs';
import RegionTitle from './RegionTitle';

const Routes = {
  RegionDetails: {
    screen: RegionTabs,
    navigationOptions: {
      title: 'Region',
    },
  },
  // Section: {
  //   screen: PlainTextScreen,
  // },
  // Filter: {
  //   screen: PlainTextScreen,
  // },
};

const Config: StackNavigatorConfig = {
  initialRouteName: 'RegionDetails',
  headerMode: 'none',
  // navigationOptions: {
  //   header: null,
  // },
};

const Navigator = createStackNavigator(Routes, Config);

interface Params {
  regionId: string;
}

export class RegionStack extends PureScreen<{}, Params> {
  static router: NavigationRouter<any, any> = Navigator.router;

  renderLoading = () => (<Loading />);

  render() {
    const { navigation } = this.props;
    return (
      <RegionProvider regionId={navigation.getParam('regionId')} renderLoading={this.renderLoading}>
        <Navigator navigation={navigation} />
      </RegionProvider>
    );
  }
}

RegionStack.navigationOptions = ({ navigation }) => ({
  title: <RegionTitle regionId={navigation.getParam('regionId')}/>,
});
