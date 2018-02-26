import * as casual from 'casual';
import { mount } from 'enzyme';
import * as React from 'react';
import { createMockedProvider, flushPromises, Receiver } from '../../test';
import { WithSource, withSource } from './withSource';

let receiver: Receiver<WithSource>;

beforeEach(async () => {
  casual.seed(1);
  const MockedProvider = createMockedProvider();
  const WithData = withSource()(Receiver);
  const wrapped = mount(
    <MockedProvider>
      <WithData sourceId="foo" />
    </MockedProvider>,
  );
  receiver = wrapped.find(Receiver).first().instance() as any;
  await flushPromises();
});

it('should have loading state', async () => {
  expect(receiver.cwrp[0].source.loading).toBe(true);
  expect(receiver.cwrp[1].source.loading).toBe(false);
});

it('should match snapshot', () => {
  expect(receiver.cwrp[1].source).toMatchSnapshot();
});
