import '@testing-library/jest-dom/extend-expect';

import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import {
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from '@testing-library/react';
import { MyProfileFragment } from '@whitewater-guide/schema';
import React from 'react';

import { configureApolloCache } from '../apollo/configureApolloCache';
import { AuthProvider } from './AuthProvider';
import { AuthContext } from './context';
import { MockAuthService } from './mockService';
import { MyProfileDocument } from './myProfile.generated';

const mockedProfile: MyProfileFragment = {
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
  editor: false,
};

const response: MockedResponse = {
  request: {
    query: MyProfileDocument,
  },
  result: {
    data: {
      me: mockedProfile,
    },
  },
};

const AuthConsumer: React.FC = () => (
  <AuthContext.Consumer>
    {({ me, loading, service }) => (
      <div>
        <div>{loading ? 'Loading' : 'Ready'}</div>
        <div>{me ? me.name : 'anonymous'}</div>
        <button type="button" onClick={() => service.signIn('facebook')}>
          Facebook
        </button>
        <button
          type="button"
          data-testid="button-out"
          onClick={() => service.signOut()}
        >
          Sign out
        </button>
      </div>
    )}
  </AuthContext.Consumer>
);

let mocks: MockAuthService;
let utils: RenderResult;

function setup() {
  const mockService = new MockAuthService();
  mocks = { ...(mockService as any) };
  const cache = configureApolloCache();
  const tree = (
    <MockedProvider mocks={[response]} cache={cache}>
      <AuthProvider
        service={mockService}
        renderInitializing={<div data-testid="initializing">Initializing</div>}
      >
        <AuthConsumer />
      </AuthProvider>
    </MockedProvider>
  );
  utils = render(tree);
}

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  utils.unmount();
});

it('should start in initializing state', async () => {
  setup();
  expect(utils.getByText(/initializing/i)).toBeInTheDocument();
  expect(() => utils.getByText(/loading/i)).toThrow();
  await expect(utils.findByText(/loading/i)).resolves.toBeInTheDocument();
});

it('should initialize service', async () => {
  setup();
  await waitFor(() => {
    expect(mocks.init).toHaveBeenCalled();
  });
});

it('should refresh token', async () => {
  setup();
  await waitFor(() => {
    expect(mocks.refreshAccessToken).toHaveBeenCalled();
  });
});

it('should render profile after initial loading', async () => {
  setup();
  await expect(utils.findByText(/Test User/)).resolves.toBeInTheDocument();
  await expect(utils.findByText(/ready/i)).resolves.toBeInTheDocument();
});

it('should start loading on sign out', async () => {
  setup();
  await utils.findByText(/ready/i);
  fireEvent.click(utils.getByText('Sign out'));
  expect(mocks.signOut).toHaveBeenCalled();
  expect(utils.getByText('Test User')).toBeInTheDocument();
  expect(utils.getByText('Loading')).toBeInTheDocument();
  await expect(utils.findByText(/ready/i)).resolves.toBeInTheDocument();
});
