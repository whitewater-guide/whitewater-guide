import { applyMiddleware, compose, createStore, Reducer } from 'redux';
import { persistReducer } from 'redux-persist';
import { default as createSagaMiddleware } from 'redux-saga';
import { appSaga } from '../sagas';
import createPersistor from './createPersistor';
import { persistConfig, rootReducer } from './reducers';

export const configureStore = () => {
  const sagaMiddleware = createSagaMiddleware();

  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const enhancer = composeEnhancers(applyMiddleware(sagaMiddleware));

  const persistedReducer: Reducer = persistReducer(persistConfig, rootReducer);

  const store = createStore(persistedReducer, enhancer);
  const persistor = createPersistor(store);

  sagaMiddleware.run(appSaga);

  return { store, persistor };
};
