import { StackNavigator } from 'react-navigation';
import { FilterScreen } from '../filter';
import RegionTabs from './RegionTabs';

const RegionModalStack = StackNavigator(
  {
    RegionStackMain: {
      screen: RegionTabs,
    },
    RegionStackFilter: {
      screen: FilterScreen,
    },
  },
  {
    initialRouteName: 'RegionStackMain',
    mode: 'modal',
    headerMode: 'none',
  },
);

RegionModalStack.displayName = 'RegionModalStack';

export default RegionModalStack;
