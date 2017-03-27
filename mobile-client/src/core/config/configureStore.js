import { createStore, applyMiddleware, compose } from 'redux';
import Reactotron from 'reactotron-react-native';
import { autoRehydrate } from 'redux-persist';
import createSagaMiddleware from 'redux-saga';
import configurePersist from './configurePersist';
import rootReducer from '../reducers/rootReducer';
import AppSaga from '../sagas/AppSaga';

export default function configureStore() {
  const middleware = [];
  const enhancers = [];

  const sagaMonitor = __DEV__ ? Reactotron.createSagaMonitor() : null;
  const sagaMiddleware = createSagaMiddleware({ sagaMonitor });
  middleware.push(sagaMiddleware);

  enhancers.push(applyMiddleware(...middleware));
  enhancers.push(autoRehydrate());

  const makeStore = __DEV__ ? Reactotron.createStore : createStore;
  const store = makeStore(rootReducer, compose(...enhancers));

  sagaMiddleware.run(AppSaga);

  configurePersist(store).catch(error => console.error(`Error while initializing persist: ${error}`));

  return store;
}
