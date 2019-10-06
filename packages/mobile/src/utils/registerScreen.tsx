import Loading from 'components/Loading';
import { register } from 'react-native-bundle-splitter';
import { NavigationScreenConfig } from 'react-navigation';

interface ScreenPreloadable<Options> {
  name?: string;
  require: () => {};
  group?: string;
  navigationOptions?: NavigationScreenConfig<Options>;
}

function registerScreen<O = any>({
  navigationOptions,
  ...preloadable
}: ScreenPreloadable<O>) {
  return register({
    ...preloadable,
    static: {
      navigationOptions,
    },
    placeholder: Loading,
  } as any);
}

export default registerScreen;
