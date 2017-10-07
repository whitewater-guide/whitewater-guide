import * as casual from 'casual';
import { mount, ReactWrapper } from 'enzyme';
import * as React from 'react';
import { createMockedProvider, Receiver } from '../../test/';
import { WithRegionsList, withRegionsList } from './withRegionsList';

const MockedProvider = createMockedProvider();

let wrapped: ReactWrapper;
let receiver: ReactWrapper<WithRegionsList>;

beforeEach(async () => {
  casual.seed(1);
  Receiver.clearMocks();
  await MockedProvider.client!.resetStore();
  const WithData = withRegionsList(Receiver);
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
  expect(Receiver.cwrp.mock.calls[0][0].regions).toMatchObject({
    list: [],
    loading: true,
  });
  expect(Receiver.cwrp.mock.calls[1][0].regions.loading).toBe(false);
});

it('should match snapshot', async () => {
  expect(Receiver.cwrp.mock.calls[0][0].regions.list).toHaveLength(0);
  expect(Receiver.cwrp.mock.calls[1][0].regions).toMatchSnapshot();
});
