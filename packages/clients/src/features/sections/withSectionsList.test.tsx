import casual from 'casual';
import { mount } from 'enzyme';
import React from 'react';
import { createMockedProvider, flushPromises, Receiver } from '../../test';
import { withSectionsList, WithSectionsList } from './withSectionsList';

let receiver: Receiver<WithSectionsList>;

beforeEach(async () => {
  casual.seed(1);
  const MockedProvider = createMockedProvider();
  const WithData = withSectionsList()(Receiver as any);
  const wrapped = mount(
    <MockedProvider>
      <WithData/>
    </MockedProvider>,
  );
  receiver = wrapped.find(Receiver as any).first().instance() as any;
  await flushPromises();
});

it('should have loading state', async () => {
  expect(receiver.cwrp[0].sections.loading).toBe(true);
  expect(receiver.cwrp[1].sections.loading).toBe(false);
});

it('should match snapshot', () => {
  expect(receiver.cwrp[1].sections).toMatchSnapshot();
});
