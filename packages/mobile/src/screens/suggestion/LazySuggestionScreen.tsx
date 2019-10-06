// tslint:disable-next-line:no-submodule-imports
import { NavigationStackOptions } from 'react-navigation-stack/lib/typescript/types';
import registerScreen from '../../utils/registerScreen';

export const LazySuggestionScreen = registerScreen<NavigationStackOptions>({
  require: () => require('./SuggestionScreen'),
  navigationOptions: ({ navigation }) => {
    const type = navigation.getParam('type') || 'simple';
    return { headerTitle: `screens:suggestion.${type}.title` };
  },
});
