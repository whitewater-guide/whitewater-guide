import { mount } from 'enzyme';
import React from 'react';
import { flushPromises, mockApolloProvider, Receiver } from '../../test';
import { withRiversList, WithRiversList } from './withRiversList';

let receiver: Receiver<WithRiversList>;

beforeEach(async () => {
  const MockedProvider = mockApolloProvider();
  const WithData = withRiversList()(Receiver as any);
  const wrapped = mount(
    <MockedProvider>
      <WithData />
    </MockedProvider>,
  );
  receiver = wrapped
    .find(Receiver as any)
    .first()
    .instance() as any;
  await flushPromises();
});

it('should have loading state', async () => {
  expect(receiver.cwrp[0].rivers.loading).toBe(true);
  expect(receiver.cwrp[1].rivers.loading).toBe(false);
});

it('should match snapshot', () => {
  expect(receiver.cwrp[1].rivers).toMatchSnapshot();
});
