import { WithTags } from '@whitewater-guide/commons';
import { mount } from 'enzyme';
import React from 'react';
import { flushPromises, mockApolloProvider, Receiver } from '../../test';
import { withTags } from './withTags';

let receiver: Receiver<WithTags>;

beforeEach(async () => {
  const MockedProvider = mockApolloProvider();
  const WithData = withTags(false)(Receiver as any);
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
  expect(receiver.cwrp[0].tagsLoading).toBe(true);
  expect(receiver.cwrp[1].tagsLoading).toBe(false);
});

it('should match snapshot', () => {
  expect(receiver.cwrp[0].tags).toMatchSnapshot();
});
