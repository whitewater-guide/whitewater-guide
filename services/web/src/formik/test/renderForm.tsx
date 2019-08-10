import { render, RenderOptions } from '@testing-library/react';
import {
  mockApolloProvider,
  MockedProviderOptions,
} from '@whitewater-guide/clients';
import React from 'react';
import { MemoryRouter, Route, Switch } from 'react-router';

const initialEntries = ['/back', '/form'];

export const FORM_SUCCEEDED = 'form_succeeded';

export const renderForm = (
  ui: React.ReactElement,
  providerOptions?: MockedProviderOptions,
  options?: Omit<RenderOptions, 'queries' | 'wrapper'>,
) => {
  const Provider = mockApolloProvider(providerOptions);
  const wrapper: React.FC = ({ children }) => (
    <Provider>
      <MemoryRouter
        initialEntries={initialEntries}
        initialIndex={initialEntries.length - 1}
      >
        <Switch>
          <Route exact={true} path="/back">
            <span>{FORM_SUCCEEDED}</span>
          </Route>

          <Route>{children}</Route>
        </Switch>
      </MemoryRouter>
    </Provider>
  );
  return render(ui, { wrapper, ...options });
};
