import React from 'react';
import { createStackNavigator, StackNavigatorConfig } from 'react-navigation';
import { NavigationContainer } from '../../../typings/react-navigation';
import { Loading } from '../../components';
import { PureScreen } from '../../utils/navigation';
import { RegionSetter, WithRegion, withRegion } from '../../ww-clients/features/regions';
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

type Props = RegionSetter & WithRegion;

class RegionStackView extends PureScreen<Props, Params> {

  componentDidMount() {
    const { setRegionId, navigation } = this.props;
    setRegionId(navigation.getParam('regionId'));
  }

  render() {
    const { navigation, region: { loading } } = this.props;
    return loading ? <Loading/> : <Navigator navigation={navigation} />;
  }
}

export const RegionStack: Partial<NavigationContainer> = withRegion(RegionStackView);
RegionStack.router = Navigator.router;

RegionStack.navigationOptions = ({ navigation }) => ({
  title: <RegionTitle regionId={navigation.getParam('regionId')}/>,
});
