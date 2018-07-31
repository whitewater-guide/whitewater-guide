import { mount } from 'enzyme';
import { MockList } from 'graphql-tools';
import React from 'react';
import { Provider } from 'react-redux';
import createMockStore from 'redux-mock-store';
import { Overwrite } from 'type-zoo';
import { LIST_SECTIONS, Result, Vars } from '../../ww-clients/features/sections';
import {
  createFixedProvider,
  createMockedProvider,
  findReceiver,
  FixedProviderOptions,
  flushPromises,
  genericReceiver,
  Receiver,
} from '../../ww-clients/test';
import { Section, SectionSearchTerms } from '../../ww-commons';
import container from './container';
import { InnerProps, SectionsStatus } from './types';

let seedSections: Section[];
let seedCount: number;
let seedData: Result;

beforeAll(async () => {
  const provider = createMockedProvider({
    mocks: {
      SectionsList: () => ({
        nodes: () => new MockList(5),
        count: () => 5,
      }),
    },
  });
  const result = await provider.client.query<Result, Vars>({
    query: LIST_SECTIONS,
  });
  seedData = result.data;
  seedSections = result.data.sections.nodes!;
  seedCount = result.data.sections.count!;
});

interface TestOptions extends Overwrite<FixedProviderOptions<Result, Vars>, {cache?: Result}> {
  isConnected?: boolean;
  searchTerms?: SectionSearchTerms;
}

const mountInHarness = async (options: TestOptions): Promise<Receiver<InnerProps>> => {
  const { isConnected = true, searchTerms = null, cache, ...opts } = options;
  const store = createMockStore()({ network: { isConnected } });
  const FixedProvider = createFixedProvider({
    ...opts,
    cache: cache && { query: LIST_SECTIONS, data: cache, variables: { filter: { regionId: 'test_region_id' } } },
  });
  const WithData = container()(genericReceiver()) as any;
  const wrapped = mount(
    <Provider store={store}>
      <FixedProvider>
        <WithData region={{ node: { id: 'test_region_id' } }} searchTerms={searchTerms} />
      </FixedProvider>
    </Provider>,
  );
  const receiver = findReceiver(wrapped);
  await flushPromises();
  return receiver;
};

it('seed data should match schema', () => {
  expect(seedData).toMatchSnapshot();
});

it('should read result from cache first', async () => {
  const receiver = await mountInHarness({
    cache: seedData,
    responses: [],
  });

  expect(receiver.props.count).toEqual(seedCount);
  expect(receiver.props.status).toEqual(SectionsStatus.READY);
  expect(receiver.props.sections).toEqual(seedSections);
});

it('should pass empty list first when cache is empty', async () => {
  const receiver = await mountInHarness({
    responses: [],
  });

  expect(receiver.cdm.count).toEqual(0);
  expect(receiver.cdm.status).toEqual(SectionsStatus.READY);
  expect(receiver.cdm.sections).toEqual([]);
});

it('should load initial data when cache contains no data', async () => {

});

it('should continue loading initial data when cache contains partial data', async () => {

});

it('should paginate initial data', async () => {

});

it('should set state to ready after all initial data has been loaded', async () => {

});

it('should start loading updates when cache is full', async () => {

});

it('should paginate updates', async () => {

});

it('should update sections count if updates contain new sections', async () => {

});

it('should set state to ready after all updates are loaded', async () => {

});

it('should not try to load anything when offline', async () => {

});

it('should release subscription when unmounted', async () => {

});

it('should poll lastMeasurements', async () => {

});

it('should pass updates when is changed outside the query', () => {

});

it('should apply filters', async () => {

});

it('something about refresh', async () => {

});
