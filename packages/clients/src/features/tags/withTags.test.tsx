import * as casual from 'casual';
import { mount } from 'enzyme';
import * as React from 'react';
import { WithTags } from '../../../ww-commons';
import { createMockedProvider, flushPromises, Receiver } from '../../test';
import { withTags } from './withTags';

let receiver: Receiver<WithTags>;

beforeEach(async () => {
  casual.seed(1);
  const MockedProvider = createMockedProvider();
  const WithData = withTags(false)(Receiver);
  const wrapped = mount(
    (
      <MockedProvider>
        <WithData />
      </MockedProvider>
    ),
  );
  receiver = wrapped.find(Receiver).first().instance() as any;
  await flushPromises();
});

it('should have loading state', async () => {
  expect(receiver.cdm.tagsLoading).toBe(true);
  expect(receiver.cwrp[0].tagsLoading).toBe(false);
});

it('should match snapshot', () => {
  expect(receiver.cwrp[0].tags).toMatchSnapshot();
});
