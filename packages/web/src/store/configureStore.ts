import { applyMiddleware, compose, createStore, Middleware, StoreEnhancer } from 'redux';
import createPersistor from './createPersistor';
import rootReducer from './rootReducer';

export async function configureStore() {
  // Nothing here, just stub
  const middleware: Middleware[] = [];
  const enhancers: Array<StoreEnhancer<any>> = [];

  enhancers.push(applyMiddleware(...middleware));
  // Apollo + redux tutorial says us to do so
  if (typeof (window as any).__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined') {
    enhancers.push((window as any).__REDUX_DEVTOOLS_EXTENSION__());
  }

  const store = createStore(rootReducer, compose(...enhancers));

  const persistor = await createPersistor(store);

  return { persistor, store };
}
