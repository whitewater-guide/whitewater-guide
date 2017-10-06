import { ReactWrapper } from 'enzyme';
import * as React from 'react';
import { gql, graphql } from 'react-apollo';
import { compose } from 'recompose';
import Loading from '../components/Loading';
import { flushPromises, mountWithMuiContext } from '../test';
import { createMockedProvider } from '../ww-clients/test';
import { withDeleteMutation, WithDeleteMutation } from './withDeleteMutation';

const removeRegion = jest.fn(() => 'deleted');
const regions = jest.fn(() => []);
const MockedProvider = createMockedProvider({ regions }, { removeRegion });

class Receiver extends React.PureComponent<WithDeleteMutation<'removeRegion'>> {
  render() {
    return null;
  }
}

const MUTATION = gql`
  mutation removeRegion($id: ID!){
    removeRegion(id: $id)
  }
`;

const QUERY = gql`query listRegions {
    regions {
      id
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
  const WithMutation = container(Receiver);
  wrapped = mountWithMuiContext(
    <MockedProvider>
      <WithMutation/>
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
  expect(regions).toBeCalled();
});

it('should render loading while mutation is in progress', () => {
  const receiver = wrapped.find(Receiver).first();
  expect(wrapped.containsMatchingElement(<Loading />)).toBe(false);
  receiver.prop('removeRegion')('foo');
  expect(wrapped.containsMatchingElement(<Loading />)).toBe(true);
});

it('should not render loading after mutation succeeds', async () => {
  const receiver = wrapped.find(Receiver).first();
  receiver.prop('removeRegion')('foo');
  await flushPromises();
  expect(wrapped.containsMatchingElement(<Loading />)).toBe(false);
});

it('should not render loading after mutation failed', async () => {
  removeRegion.mockImplementation(() => { throw new Error('oops'); });
  const receiver = wrapped.find(Receiver).first();
  receiver.prop('removeRegion')('foo');
  await flushPromises();
  expect(wrapped.containsMatchingElement(<Loading />)).toBe(false);
});

