import React from 'react';
import { Provider } from 'react-redux';
import RootView from './core/RootView';
import configureStore from './core/config/configureStore';

// create our store
const store = configureStore();

export default function App() {
  return (
    <Provider store={store}>
      <RootView />
    </Provider>
  );
}
