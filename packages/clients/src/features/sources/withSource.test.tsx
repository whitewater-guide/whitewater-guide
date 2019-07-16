import { mount } from 'enzyme';
import React from 'react';
import { flushPromises, mockApolloProvider, Receiver } from '../../test';
import { WithSource, withSource } from './withSource';

let receiver: Receiver<WithSource>;

beforeEach(async () => {
  const MockedProvider = mockApolloProvider();
  const WithData = withSource()(Receiver as any);
  const wrapped = mount(
    <MockedProvider>
      <WithData sourceId="foo" />
    </MockedProvider>,
  );
  receiver = wrapped
    .find(Receiver as any)
    .first()
    .instance() as any;
  await flushPromises();
});

it('should have loading state', async () => {
  expect(receiver.cwrp[0].source.loading).toBe(true);
  expect(receiver.cwrp[1].source.loading).toBe(false);
});

it('should match snapshot', () => {
  expect(receiver.cwrp[1].source).toMatchSnapshot();
});
