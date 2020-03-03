import { AppRegistry } from 'react-native';
import 'react-native-gesture-handler';
// import App from './storybook';
import MDCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import App from './src/App';

// This is required do to use_frameworks! in Podfile
MDCommunity.loadFont();
MaterialIcons.loadFont();

AppRegistry.registerComponent('whitewater', () => App);
