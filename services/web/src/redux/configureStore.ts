import {
  applyMiddleware,
  compose,
  createStore,
  Middleware,
  StoreEnhancer,
} from 'redux';
import rootReducer from './rootReducer';

function configureStore() {
  // Nothing here, just stub
  const middleware: Middleware[] = [];
  const enhancers: Array<StoreEnhancer<any>> = [];

  enhancers.push(applyMiddleware(...middleware));
  // Apollo + redux tutorial says us to do so
  if (typeof (window as any).__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined') {
    enhancers.push((window as any).__REDUX_DEVTOOLS_EXTENSION__());
  }

  return createStore(rootReducer, compose(...enhancers));
}

export const store = configureStore();
