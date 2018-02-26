import * as casual from 'casual';
import { mount } from 'enzyme';
import * as React from 'react';
import { createMockedProvider, flushPromises, Receiver } from '../../test';
import { WithRiver, withRiver } from './withRiver';

let receiver: Receiver<WithRiver>;

beforeEach(async () => {
  casual.seed(1);
  const MockedProvider = createMockedProvider();
  const WithData = withRiver()(Receiver);
  const wrapped = mount(
    <MockedProvider>
      <WithData riverId="foo" />
    </MockedProvider>,
  );
  receiver = wrapped.find(Receiver).first().instance() as any;
  await flushPromises();
});

it('should have loading state', async () => {
  expect(receiver.cwrp[0].river.loading).toBe(true);
  expect(receiver.cwrp[1].river.loading).toBe(false);
});

it('should match snapshot', () => {
  expect(receiver.cwrp[1].river).toMatchSnapshot();
});
