import { mount } from 'enzyme';
import React from 'react';
import { flushPromises, mockApolloProvider, Receiver } from '../../test';
import { withRegionsList, WithRegionsList } from './withRegionsList';

let receiver: Receiver<WithRegionsList>;

beforeEach(async () => {
  const MockedProvider = mockApolloProvider();
  const WithData = withRegionsList(Receiver as any);
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
    regions: {
      nodes: [],
      loading: true,
      count: 0,
    },
  });
  expect(receiver.cwrp[1].regions.loading).toBe(false);
});

it('should match snapshot', async () => {
  expect(receiver.cwrp[0].regions.nodes).toHaveLength(0);
  expect(receiver.cwrp[1].regions).toMatchSnapshot();
});
