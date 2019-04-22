import React from 'react';
import { MockedProvider, MockedResponse } from 'react-apollo/test-utils';
import { act, fireEvent, render, RenderResult } from 'react-testing-library';
import { MY_PROFILE_QUERY } from '../features/users';
import { flushPromises } from '../test';
import { AuthProvider } from './AuthProvider';
import { AuthContext } from './context';
import { AuthService } from './service';

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
    {({ me, loading, signIn, signOut }) => {
      if (loading) {
        return <div>Loading</div>;
      }
      return (
        <div>
          <span data-testid="auth-name">{me ? me.name : 'anonymous'}</span>
          <button data-testid="button-in" onClick={() => signIn('facebook')} />
          <button data-testid="button-out" onClick={() => signOut()} />
        </div>
      );
    }}
  </AuthContext.Consumer>
);

const mockService: AuthService = {
  refreshAccessToken: jest.fn(() => Promise.resolve()),
  signIn: jest.fn(() => Promise.resolve()),
  signOut: jest.fn(() => Promise.resolve()),
};

let utils: RenderResult;

describe('user', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const tree = (
      <MockedProvider mocks={[mockUser]}>
        <AuthProvider service={mockService}>
          <AuthConsumer />
        </AuthProvider>
      </MockedProvider>
    );
    utils = render(tree);
  });
  it('should start in loading state', () => {
    expect(utils.getByText(/Loading/)).toBeTruthy();
  });

  it('should refresh token', () => {
    expect(mockService.refreshAccessToken).toHaveBeenCalled();
  });

  it('should start loading apollo after refreshing token', async () => {
    await flushPromises();
    expect(mockService.refreshAccessToken).toHaveBeenCalled();
    expect(utils.getByText(/Loading/)).toBeTruthy();
  });

  it('should render profile', async () => {
    await flushPromises(2);
    expect(utils.getByTestId('auth-name')).toBeTruthy();
  });

  it('should sign out', async () => {
    await flushPromises(2);
    fireEvent.click(utils.getByTestId('button-out'));
    expect(mockService.signOut).toHaveBeenCalled();
  });

  it('should start loading on sign out', async () => {
    await flushPromises(2);
    act(() => fireEvent.click(utils.getByTestId('button-out')));
    await flushPromises();
    expect(utils.getByText(/Loading/)).toBeTruthy();
  });
});
