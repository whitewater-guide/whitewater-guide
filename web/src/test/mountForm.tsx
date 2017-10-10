import { History } from 'history';
import * as React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Router } from 'react-router';
import { ComponentEnhancer } from 'recompose';
import { combineReducers, createStore } from 'redux';
import { InjectedFormProps, reducer as formReducer } from 'redux-form';
import { createMockedProvider } from '../ww-clients/test';
import { mountWithMuiContext } from './muiTestUtils';

export class FormReceiver extends React.PureComponent<InjectedFormProps<any>> {

  render() {
    return (
      <form onSubmit={this.props.handleSubmit} />
    );
  }
}

interface Options {
  form: ComponentEnhancer<any, any>;
  mockApollo?: boolean;
  props?: {[ key: string]: any};
  history?: History;
}

export const mountForm = (options: Options) => {
  const { form, mockApollo, props = {}, history } = options;
  const store = createStore(combineReducers({ form: formReducer }));
  const Wrapped: React.ComponentType<any> = form(FormReceiver);
  let router = !!history ?
    (
      <Router history={history}>
        <Wrapped {...props} />
      </Router>
    ) :
    (
      <MemoryRouter>
        <Wrapped {...props} />
      </MemoryRouter>
    );
  if (mockApollo) {
    const MockedProvider = createMockedProvider();
    router = (
      <MockedProvider>
        {router}
      </MockedProvider>
    );
  }
  return mountWithMuiContext((
    <Provider store={store}>
      {router}
    </Provider>),
  );
};
