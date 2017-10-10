import * as casual from 'casual';
import { mount, ReactWrapper } from 'enzyme';
import * as React from 'react';
import { createMockedProvider, flushPromises, Receiver } from '../../test';
import { NEW_SOURCE, withSource, WithSource, WithSourceOptions } from './withSource';

const casualSourceId = '7fbe024f-3316-4265-a6e8-c65a837e308a'; // what casual generates first

const MockedProvider = createMockedProvider();

let wrapped: ReactWrapper;
let receiver: ReactWrapper<WithSource>;

beforeEach(async () => {
  casual.seed(1);
  Receiver.clearMocks();
  await MockedProvider.client!.resetStore();
});

afterEach(() => {
  wrapped.unmount();
});

const mountWithOptions = (options: WithSourceOptions = {}, sourceId?: string) => {
  const WithData = withSource(options)(Receiver);
  wrapped = mount(
    <MockedProvider>
      <WithData sourceId={sourceId} />
    </MockedProvider>,
  );
  receiver = wrapped.find(Receiver).first();
};

it('should have a loading state', async () => {
  mountWithOptions({}, casualSourceId);
  await flushPromises();
  const lastCall = Receiver.cwrp.mock.calls.length - 1;
  expect(lastCall).toBe(1);
  expect(Receiver.cwrp.mock.calls[0][0].source.loading).toBe(true);
  expect(Receiver.cwrp.mock.calls[lastCall][0].source.loading).toBe(false);
});

it('should pass new source when no sourceId is not found', async () => {
  mountWithOptions();
  await flushPromises();
  expect(receiver.prop('source').data).toEqual(NEW_SOURCE);
});

it('should match snapshot', async () => {
  mountWithOptions({}, casualSourceId);
  await flushPromises();
  expect(receiver.props()).toMatchSnapshot();
});
