import '@testing-library/jest-dom/extend-expect';

import { MockedProvider, MockedResponse } from '@apollo/react-testing';
import { fireEvent, render, RenderResult } from '@testing-library/react';
import React from 'react';

import { flushPromises } from '../test';
import { AuthProvider } from './AuthProvider';
import { AuthContext } from './context';
import { MockAuthService } from './mockService';
import { MY_PROFILE_QUERY } from './myProfile.query';

const mockUser: MockedResponse = {
  request: {
    query: MY_PROFILE_QUERY,
  },
  result: {
    data: {
      me: {
        __typename: 'User',
        id: 'uid',
        name: 'Test User',
        avatar: null,
        email: null,
        admin: false,
        language: 'en',
        imperial: false,
        verified: true,
        editorSettings: null,
        accounts: [],
      },
    },
  },
};

const AuthConsumer: React.FC = () => (
  <AuthContext.Consumer>
    {({ me, loading, service }) => {
      return (
        <div>
          <div data-testid="loading">{loading ? 'Loading' : 'Ready'}</div>
          <div data-testid="username">{me ? me.name : 'anonymous'}</div>
          <button
            data-testid="button-in"
            onClick={() => service.signIn('facebook')}
          />
          <button data-testid="button-out" onClick={() => service.signOut()} />
        </div>
      );
    }}
  </AuthContext.Consumer>
);

let mocks: MockAuthService;
let utils: RenderResult;

beforeEach(() => {
  jest.clearAllMocks();
  const mockService = new MockAuthService();
  mocks = { ...(mockService as any) };
  const tree = (
    <MockedProvider mocks={[mockUser]}>
      <AuthProvider
        service={mockService}
        renderInitializing={<div data-testid="initializing">Initializing</div>}
      >
        <AuthConsumer />
      </AuthProvider>
    </MockedProvider>
  );
  utils = render(tree);
});

afterEach(() => {
  utils.unmount();
});

it('should start in initializing state', () => {
  expect(utils.getByTestId('initializing')).toHaveTextContent('Initializing');
  expect(() => utils.getByTestId('loading')).toThrow();
});

it('should initialize service', () => {
  expect(mocks.init).toHaveBeenCalled();
});

it('should refresh token', () => {
  expect(mocks.refreshAccessToken).toHaveBeenCalled();
});

it('should render profile after initial loading', async () => {
  await flushPromises(3);
  expect(utils.getByTestId('username')).toHaveTextContent('Test User');
  expect(utils.getByTestId('loading')).toHaveTextContent('Ready');
});

it('should start loading on sign out', async () => {
  await flushPromises();
  fireEvent.click(utils.getByTestId('button-out'));
  expect(mocks.signOut).toHaveBeenCalled();
  expect(utils.getByTestId('username')).toHaveTextContent('Test User');
  expect(utils.getByTestId('loading')).toHaveTextContent('Loading');
});

it('should sign out', async () => {
  await flushPromises();
  fireEvent.click(utils.getByTestId('button-out'));
  await flushPromises();
  expect(utils.getByTestId('username')).toHaveTextContent('Test User');
  expect(utils.getByTestId('loading')).toHaveTextContent('Ready');
});
