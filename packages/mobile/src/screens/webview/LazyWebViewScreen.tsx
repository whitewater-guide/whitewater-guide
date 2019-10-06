// tslint:disable-next-line:no-submodule-imports
import { NavigationStackOptions } from 'react-navigation-stack/lib/typescript/types';
import registerScreen from '../../utils/registerScreen';

export const LazyWebViewScreen = registerScreen<NavigationStackOptions>({
  require: () => require('./WebViewScreen'),
  navigationOptions: ({ navigation }) => {
    return { headerTitle: navigation.getParam('title') };
  },
});
