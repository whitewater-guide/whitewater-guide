import {
  act,
  render,
  waitForElementToBeRemoved,
} from '@testing-library/react-native';
import { dataIdFromObject } from '@whitewater-guide/clients';
import { mockApolloProvider } from '@whitewater-guide/clients/dist/test';
import gql from 'graphql-tag';
import { MockList } from 'graphql-tools';
import React from 'react';

import RegionsListView from './RegionsListView';

jest.mock('@react-navigation/native', () => ({
  // eslint-disable-next-line @typescript-eslint/ban-types
  ...jest.requireActual<{}>('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

it('should rerender when premium changes', async () => {
  const hasPremiumAccess = jest
    .fn()
    .mockReturnValueOnce(false)
    .mockReturnValue(true);
  const ApolloProvider = mockApolloProvider({
    mocks: {
      RegionsList: () => ({
        nodes: () => new MockList(3),
        count: () => 3,
      }),
      Region: () => ({
        premium: () => true,
        hasPremiumAccess,
      }),
    },
  });
  const Providers: React.FC = ({ children }) => {
    return <ApolloProvider>{children}</ApolloProvider>;
  };

  const { rerender, getByLabelText, getAllByLabelText } = render(
    <RegionsListView />,
    {
      wrapper: Providers,
    },
  );
  await waitForElementToBeRemoved(() => getByLabelText('loading'));
  expect(getByLabelText('buy premium')).toBeTruthy();
  expect(getAllByLabelText('has premium access')).toHaveLength(2);
  act(() =>
    ApolloProvider.client.writeFragment({
      data: { __typename: 'Region', id: 'Region.id.1', hasPremiumAccess: true },
      id: dataIdFromObject({ __typename: 'Region', id: 'Region.id.1' })!,
      fragment: gql`
        fragment testFrag on Region {
          id
          hasPremiumAccess
        }
      `,
    }),
  );
  rerender(<RegionsListView />);
  expect(getAllByLabelText('has premium access')).toHaveLength(3);
  expect(() => getByLabelText('buy premium')).toThrow();
});
