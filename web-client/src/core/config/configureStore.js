import { createStore, applyMiddleware, compose } from 'redux';
import { autoRehydrate } from 'redux-persist';
import configurePersist from './configurePersist';
import { apolloClient } from './configureApollo';
import rootReducer from '../reducers/rootReducer';

export default function configureStore() {
  const middleware = [];
  const enhancers = [];

  middleware.push(apolloClient.middleware());

  enhancers.push(applyMiddleware(...middleware));
  enhancers.push(autoRehydrate());
  // Apollo + redux tutorial says us to do so
  if (typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined') {
    enhancers.push(window.__REDUX_DEVTOOLS_EXTENSION__());
  }

  const store = createStore(rootReducer, compose(...enhancers));

  configurePersist(store).catch(error => console.error(`Error while initializing persist: ${error}`));

  return store;
}
