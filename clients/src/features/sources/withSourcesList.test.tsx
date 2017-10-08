import * as casual from 'casual';
import { mount, ReactWrapper } from 'enzyme';
import * as React from 'react';
import { createMockedProvider, Receiver } from '../../test/';
import { WithSourcesList, withSourcesList } from './withSourcesList';

const MockedProvider = createMockedProvider();

let wrapped: ReactWrapper;
let receiver: ReactWrapper<WithSourcesList>;

beforeEach(async () => {
  casual.seed(1);
  Receiver.clearMocks();
  await MockedProvider.client!.resetStore();
  const WithData = withSourcesList(Receiver);
  wrapped = mount(
    <MockedProvider>
      <WithData/>
    </MockedProvider>,
  );
  receiver = wrapped.find(Receiver).first();
});

afterEach(() => {
  wrapped.unmount();
});

it('should have loading state', async () => {
  expect(Receiver.cwrp.mock.calls[0][0].sources).toMatchObject({
    list: [],
    loading: true,
  });
  expect(Receiver.cwrp.mock.calls[1][0].sources.loading).toBe(false);
});

it('should match snapshot', async () => {
  expect(Receiver.cwrp.mock.calls[0][0].sources.list).toHaveLength(0);
  expect(Receiver.cwrp.mock.calls[1][0].sources).toMatchSnapshot();
});
