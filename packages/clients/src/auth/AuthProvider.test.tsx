import { fireEvent, render, RenderResult } from '@testing-library/react';
import 'jest-dom/extend-expect';
import React from 'react';
import { MockedProvider, MockedResponse } from 'react-apollo/test-utils';
import { MY_PROFILE_QUERY } from '../features/users';
import { flushPromises } from '../test';
import { AuthProvider } from './AuthProvider';
import { AuthContext } from './context';
import { MockAuthService } from './mockService';

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
      },
    },
  },
};
const mockAnon: MockedResponse = {
  request: {
    query: MY_PROFILE_QUERY,
  },
  result: {
    data: {
      me: null,
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

beforeEach(async () => {
  jest.clearAllMocks();
  const mockService = new MockAuthService();
  mocks = { ...(mockService as any) };
  await mockService.init();
  const tree = (
    <MockedProvider mocks={[mockUser]}>
      <AuthProvider service={mockService}>
        <AuthConsumer />
      </AuthProvider>
    </MockedProvider>
  );
  utils = render(tree);
});
afterEach(() => utils.unmount());

it('should start in loading state', () => {
  expect(utils.getByTestId('username')).toHaveTextContent('anonymous');
  expect(utils.getByTestId('loading')).toHaveTextContent('Loading');
});

it('should refresh token', () => {
  expect(mocks.refreshAccessToken).toHaveBeenCalled();
});

it('should render profile after initial loading', async () => {
  await flushPromises(2);
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
