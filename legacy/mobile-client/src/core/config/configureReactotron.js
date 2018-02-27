import Reactotron, { trackGlobalErrors, asyncStorage, networking } from 'reactotron-react-native';
import sagaPlugin from 'reactotron-redux-saga';
import apisaucePlugin from 'reactotron-apisauce';
import { reactotronRedux } from 'reactotron-redux';

if (__DEV__) {
  Reactotron
    .configure() // we can use plugins here -- more on this later
    .use(trackGlobalErrors())
    .use(networking())
    .use(apisaucePlugin())
    .use(reactotronRedux())
    .use(asyncStorage())
    .use(sagaPlugin())
    .connect(); // let's connect!

  Reactotron.clear();
  console.tron = Reactotron;
} else {
  console.tron = {
    log: () => false,
    warn: () => false,
    error: () => false,
    display: () => false,
    image: () => false,
  };
}