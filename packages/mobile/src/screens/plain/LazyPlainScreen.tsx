// tslint:disable-next-line:no-submodule-imports
import { NavigationStackOptions } from 'react-navigation-stack/lib/typescript/types';
import registerScreen from '../../utils/registerScreen';

export const LazyPlainScreen = registerScreen<NavigationStackOptions>({
  require: () => require('./PlainTextScreen'),
  navigationOptions: ({ navigation }) => {
    return { headerTitle: navigation.getParam('title') };
  },
});
