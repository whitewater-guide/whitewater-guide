import { applyMiddleware, compose, createStore, Middleware, StoreEnhancer } from 'redux';
import { autoRehydrate } from 'redux-persist';
import rootReducer from '../reducers/rootReducer';
import { apolloClient } from './configureApollo';
import configurePersist from './configurePersist';

type Enhancer = StoreEnhancer<any>;

export default function configureStore() {
  const middleware: Middleware[] = [];
  const enhancers: Enhancer[] = [];

  middleware.push(apolloClient.middleware());

  enhancers.push(applyMiddleware(...middleware));
  enhancers.push(autoRehydrate());
  // Apollo + redux tutorial says us to do so
  if (typeof (window as any).__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined') {
    enhancers.push((window as any).__REDUX_DEVTOOLS_EXTENSION__());
  }

  const store = createStore(rootReducer, compose(...enhancers));

  configurePersist(store).catch(error => console.error(`Error while initializing persist: ${error}`));

  return store;
}
