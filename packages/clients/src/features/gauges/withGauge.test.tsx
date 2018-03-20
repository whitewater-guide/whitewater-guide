import casual from 'casual';
import { mount } from 'enzyme';
import React from 'react';
import { createMockedProvider, flushPromises, Receiver } from '../../test';
import { WithGauge, withGauge } from './withGauge';

let receiver: Receiver<WithGauge>;

beforeEach(async () => {
  casual.seed(1);
  const MockedProvider = createMockedProvider();
  const WithData = withGauge()(Receiver);
  const wrapped = mount(
    <MockedProvider>
      <WithData gaugeId="foo" />
    </MockedProvider>,
  );
  receiver = wrapped.find(Receiver).first().instance() as any;
  await flushPromises();
});

it('should have loading state', async () => {
  expect(receiver.cwrp[0].gauge.loading).toBe(true);
  expect(receiver.cwrp[1].gauge.loading).toBe(false);
});

it('should match snapshot', () => {
  expect(receiver.cwrp[1].gauge).toMatchSnapshot();
});
