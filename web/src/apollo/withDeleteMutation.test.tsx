import { ReactWrapper } from 'enzyme';
import * as React from 'react';
import { gql } from 'react-apollo';
import { createMockedProvider } from '../../../clients/src/test';
import { flushPromises, mountWithMuiContext } from '../test';
import { withDeleteMutation, WithDeleteMutation } from './withDeleteMutation';

const removeRegion = jest.fn(() => 'deleted');
const refetchQuery = jest.fn();
const MockedProvider = createMockedProvider({ refetchQuery }, { removeRegion });
const client = MockedProvider.client;

class Receiver extends React.PureComponent<WithDeleteMutation<'removeRegion'>> {
  render() {
    return null;
  }
}

const container = withDeleteMutation({
  mutation: gql`
    mutation removeRegion($id: ID!){
      removeRegion(id: $id)
    }
  `,
  propName: 'removeRegion',
  refetchQueries: ['refetchQuery'],
});

let wrapped: ReactWrapper;

beforeEach(() => {
  removeRegion.mockClear();
  refetchQuery.mockClear();
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
  const spy = jest.spyOn(client!, 'mutate');
  receiver.prop('removeRegion')('foo');
  expect(spy).toBeCalled();

  await flushPromises();
  await flushPromises();
  await flushPromises();
  expect(removeRegion).toBeCalled();
});

it('should refetch queries', () => {

});

it('should render loading while mutation is in progress', () => {

});

it('should not render loading after mutation succeeds', () => {

});

it('should not render loading after mutation failed', () => {

});
