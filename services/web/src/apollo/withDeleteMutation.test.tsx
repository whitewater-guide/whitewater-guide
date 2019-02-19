import { createMockedProvider, flushPromises } from '@whitewater-guide/clients';
import { ReactWrapper } from 'enzyme';
import gql from 'graphql-tag';
import React from 'react';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import { Loading } from '../components';
import { mountWithMuiContext } from '../test';
import { withDeleteMutation, WithDeleteMutation } from './withDeleteMutation';

const removeRegion = jest.fn(() => 'deleted');
const regions = jest.fn(() => []);
const MockedProvider = createMockedProvider({
  Query: { regions },
  Mutation: { removeRegion },
});

class Receiver extends React.PureComponent<WithDeleteMutation<'removeRegion'>> {
  render() {
    return null;
  }
}

const MUTATION = gql`
  mutation removeRegion($id: ID!) {
    removeRegion(id: $id)
  }
`;

const QUERY = gql`
  query listRegions {
    regions {
      nodes {
        id
        name
      }
      count
    }
  }
`;

const container = compose(
  graphql(QUERY),
  withDeleteMutation({
    mutation: MUTATION,
    propName: 'removeRegion',
    refetchQueries: ['listRegions'],
  }),
);

let wrapped: ReactWrapper;

beforeEach(() => {
  removeRegion.mockClear();
  regions.mockClear();
  const WithMutation = container(Receiver as any);
  wrapped = mountWithMuiContext(
    <MockedProvider>
      <WithMutation />
    </MockedProvider>,
  );
});

it('should pass delete handle as props', () => {
  const receiver = wrapped.find(Receiver).at(0);
  expect(receiver.prop('removeRegion')).toBeInstanceOf(Function);
});

it('should call mutation', async () => {
  const receiver = wrapped.find(Receiver).first();
  receiver.prop('removeRegion')('foo');
  await flushPromises();
  expect(removeRegion).toBeCalled();
});

it('should refetch queries', async () => {
  const receiver = wrapped.find(Receiver).first();
  receiver.prop('removeRegion')('foo');
  await flushPromises();
  wrapped.update();
  expect(regions).toBeCalled();
});

it('should render loading while mutation is in progress', () => {
  const receiver = wrapped.find(Receiver).first();
  expect(wrapped.containsMatchingElement(<Loading />)).toBe(false);
  receiver.prop('removeRegion')('foo');
  wrapped.update();
  expect(wrapped.containsMatchingElement(<Loading />)).toBe(true);
});

it('should not render loading after mutation succeeds', async () => {
  const receiver = wrapped.find(Receiver).first();
  receiver.prop('removeRegion')('foo');
  await flushPromises();
  expect(wrapped.containsMatchingElement(<Loading />)).toBe(false);
});

it('should not render loading after mutation failed', async () => {
  removeRegion.mockImplementation(() => {
    throw new Error('oops');
  });
  const receiver = wrapped.find(Receiver).first();
  receiver.prop('removeRegion')('foo');
  await flushPromises();
  expect(wrapped.containsMatchingElement(<Loading />)).toBe(false);
});
