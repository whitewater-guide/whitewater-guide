import type { RenderOptions } from '@testing-library/react';
import { render } from '@testing-library/react';
import type { MockedProviderOptions } from '@whitewater-guide/clients/dist/test';
import { mockApolloProvider } from '@whitewater-guide/clients/dist/test';
import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { MemoryRouter, Route, Switch } from 'react-router';

const initialEntries = ['/back', '/form'];

export const FORM_SUCCEEDED = 'form_succeeded';

export function renderForm(
  ui: React.ReactElement,
  providerOptions?: MockedProviderOptions,
  options?: Omit<RenderOptions, 'queries' | 'wrapper'>,
): void {
  const Provider = mockApolloProvider(providerOptions);
  const wrapper: FC<PropsWithChildren> = ({ children }) => (
    <Provider>
      <MemoryRouter
        initialEntries={initialEntries}
        initialIndex={initialEntries.length - 1}
      >
        <Switch>
          <Route exact path="/back">
            <span>{FORM_SUCCEEDED}</span>
          </Route>

          <Route>{children}</Route>
        </Switch>
      </MemoryRouter>
    </Provider>
  );
  render(ui, { wrapper, ...options });
}
