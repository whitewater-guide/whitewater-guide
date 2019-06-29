import { mount } from 'enzyme';
import React from 'react';
import { flushPromises, mockApolloProvider, Receiver } from '../../test';
import { WithGauge, withGauge } from './withGauge';

let receiver: Receiver<WithGauge>;

beforeEach(async () => {
  const MockedProvider = mockApolloProvider();
  const WithData = withGauge()(Receiver as any);
  const wrapped = mount(
    <MockedProvider>
      <WithData gaugeId="foo" />
    </MockedProvider>,
  );
  receiver = wrapped
    .find(Receiver as any)
    .first()
    .instance() as any;
  await flushPromises();
});

it('should have loading state', async () => {
  expect(receiver.cwrp[0].gauge.loading).toBe(true);
  expect(receiver.cwrp[1].gauge.loading).toBe(false);
});

it('should match snapshot', () => {
  expect(receiver.cwrp[1].gauge).toMatchSnapshot();
});
