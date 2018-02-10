import * as casual from 'casual';
import { mount } from 'enzyme';
import * as React from 'react';
import { createMockedProvider, flushPromises, Receiver } from '../../test';
import { withRiversList, WithRiversList } from './withRiversList';

let receiver: Receiver<WithRiversList>;

beforeEach(async () => {
  casual.seed(1);
  const MockedProvider = createMockedProvider();
  const WithData = withRiversList()(Receiver);
  const wrapped = mount(
    <MockedProvider>
      <WithData/>
    </MockedProvider>,
  );
  receiver = wrapped.find(Receiver).first().instance() as any;
  await flushPromises();
});

it('should have loading state', async () => {
  expect(receiver.cwrp[0].rivers.loading).toBe(true);
  expect(receiver.cwrp[1].rivers.loading).toBe(false);
});

it('should match snapshot', () => {
  expect(receiver.cwrp[1].rivers).toMatchSnapshot();
});
