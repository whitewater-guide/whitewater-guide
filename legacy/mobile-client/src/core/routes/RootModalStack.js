import { StackNavigator } from 'react-navigation';
import { PlainTextScreen } from '../../screens';
import RootTabs from './RootTabs';

const Routes = {
  Root: {
    screen: RootTabs,
  },
  Plain: {
    screen: PlainTextScreen,
  },
};

const Config = {
  initialRouteName: 'Root',
  mode: 'modal',
};

const RootModalStack = StackNavigator(Routes, Config);

export default RootModalStack;
