import * as casual from 'casual';
import { mount } from 'enzyme';
import * as React from 'react';
import { createMockedProvider, flushPromises, Receiver } from '../../test';
import { withSectionsList, WithSectionsList } from './withSectionsList';

let receiver: Receiver<WithSectionsList>;

beforeEach(async () => {
  casual.seed(1);
  const MockedProvider = createMockedProvider();
  const WithData = withSectionsList()(Receiver);
  const wrapped = mount(
    <MockedProvider>
      <WithData/>
    </MockedProvider>,
  );
  receiver = wrapped.find(Receiver).first().instance() as any;
  await flushPromises();
});

it('should have loading state', async () => {
  expect(receiver.cwrp[0].sections.loading).toBe(true);
  expect(receiver.cwrp[1].sections.loading).toBe(false);
});

it('should match snapshot', () => {
  expect(receiver.cwrp[1].sections).toMatchSnapshot();
});
