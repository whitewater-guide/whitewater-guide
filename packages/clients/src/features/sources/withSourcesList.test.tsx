import * as casual from 'casual';
import { mount, ReactWrapper } from 'enzyme';
import * as React from 'react';
import { createMockedProvider, Receiver } from '../../test';
import { WithSourcesList, withSourcesList } from './withSourcesList';
import { flushPromises } from '../../test';

let receiver: Receiver<WithSourcesList>;

beforeEach(async () => {
  casual.seed(1);
  const MockedProvider = createMockedProvider();
  const WithData = withSourcesList(Receiver);
  const wrapped = mount(
    <MockedProvider>
      <WithData/>
    </MockedProvider>,
  );
  receiver = wrapped.find(Receiver).first().instance() as any;
  await flushPromises();
});

it('should have loading state', async () => {
  expect(receiver.cwrp[0]).toMatchObject({
    sources: {
      nodes: [],
      loading: true,
      count: 0,
    },
  });
  expect(receiver.cwrp[1].sources.loading).toBe(false);
});

it('should match snapshot', async () => {
  expect(receiver.cwrp[0].sources.nodes).toHaveLength(0);
  expect(receiver.cwrp[1].sources).toMatchSnapshot();
});
