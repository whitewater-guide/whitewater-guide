import { mount } from 'enzyme';
import React from 'react';
import { createMockedProvider, flushPromises, Receiver } from '../../test';
import { WithSourcesList, withSourcesList } from './withSourcesList';

let receiver: Receiver<WithSourcesList>;

beforeEach(async () => {
  const MockedProvider = createMockedProvider();
  const WithData = withSourcesList(Receiver as any);
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
