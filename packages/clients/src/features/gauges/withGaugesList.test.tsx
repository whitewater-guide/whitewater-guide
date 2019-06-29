import { mount } from 'enzyme';
import React from 'react';
import { flushPromises, mockApolloProvider, Receiver } from '../../test';
import { withGaugesList, WithGaugesList } from './withGaugesList';

let receiver: Receiver<WithGaugesList>;

beforeEach(async () => {
  const MockedProvider = mockApolloProvider();
  const WithData = withGaugesList(Receiver as any);
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
  expect(receiver.cwrp[0].gauges.loading).toBe(true);
  expect(receiver.cwrp[1].gauges.loading).toBe(false);
});

it('should match snapshot', () => {
  expect(receiver.cwrp[1].gauges).toMatchSnapshot();
});
