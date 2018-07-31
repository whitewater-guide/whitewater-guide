import { mount } from 'enzyme';
import React from 'react';
import { createMockedProvider, flushPromises, Receiver } from '../../test';
import { WithRiver, withRiver } from './withRiver';

let receiver: Receiver<WithRiver>;

beforeEach(async () => {
  const MockedProvider = createMockedProvider();
  const WithData = withRiver()(Receiver as any);
  const wrapped = mount(
    <MockedProvider>
      <WithData riverId="foo" />
    </MockedProvider>,
  );
  receiver = wrapped.find(Receiver as any).first().instance() as any;
  await flushPromises();
});

it('should have loading state', async () => {
  expect(receiver.cwrp[0].river.loading).toBe(true);
  expect(receiver.cwrp[1].river.loading).toBe(false);
});

it('should match snapshot', () => {
  expect(receiver.cwrp[1].river).toMatchSnapshot();
});
