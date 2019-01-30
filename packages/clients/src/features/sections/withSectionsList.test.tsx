import { mount } from 'enzyme';
import React from 'react';
import {
  createMockedProvider,
  findReceiver,
  flushPromises,
  genericReceiver,
  Receiver,
} from '../../test';
import { withSectionsList, WithSectionsList } from './withSectionsList';

let receiver: Receiver<WithSectionsList>;

beforeEach(async () => {
  const MockedProvider = createMockedProvider();
  const WithData = withSectionsList()(genericReceiver());
  const wrapped = mount(
    <MockedProvider>
      <WithData />
    </MockedProvider>,
  );
  receiver = findReceiver(wrapped);
  await flushPromises();
});

it('should have loading state', async () => {
  expect(receiver.cwrp[0].sections.loading).toBe(true);
  expect(receiver.cwrp[1].sections.loading).toBe(false);
});

it('should match snapshot', () => {
  expect(receiver.cwrp[1].sections).toMatchSnapshot();
});
