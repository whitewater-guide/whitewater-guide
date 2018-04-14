import { createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers';
import { applyMiddleware, compose, createStore, Middleware, StoreCreator, StoreEnhancer } from 'redux';
import { default as createSagaMiddleware } from 'redux-saga';
import { persistedRootReducer, RootState } from '../reducers';
import { appSaga } from '../sagas';
import createPersistor from './createPersistor';

declare var window: Window & { devToolsExtension: any, __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any };

export default async function configureStore() {
  const middleware: Middleware[] = [];
  const enhancers: Array<StoreEnhancer<RootState>> = [];

  // const sagaMonitor = __DEV__ ? Reactotron.createSagaMonitor() : undefined;
  const sagaMonitor = undefined;
  const sagaMiddleware = createSagaMiddleware({ sagaMonitor });
  middleware.push(sagaMiddleware);

  const navMiddleware = createReactNavigationReduxMiddleware(
    'root',
    (state: RootState) => state.nav,
  );
  middleware.push(navMiddleware);

  enhancers.push(applyMiddleware(...middleware));

  // const makeStore: StoreCreator = __DEV__ ? Reactotron.createStore : createStore;
  const makeStore: StoreCreator = createStore;

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = makeStore(persistedRootReducer, composeEnhancers(...enhancers));

  sagaMiddleware.run(appSaga);

  await createPersistor(store);

  return store;
}
