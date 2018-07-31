import ApolloClient from 'apollo-client';
import { mount, ReactWrapper } from 'enzyme';
import gql from 'graphql-tag';
import { MockList } from 'graphql-tools';
import React from 'react';
import { Overwrite } from 'type-zoo';
import { dataIdFromObject } from '../../ww-clients/apollo';
import { POLL_REGION_MEASUREMENTS } from '../../ww-clients/features/regions';
import { LIST_SECTIONS, Result, Vars } from '../../ww-clients/features/sections';
import {
  createFixedProvider,
  createMockedProvider,
  FixedProviderOptions,
  flushPromises,
  MockLink,
} from '../../ww-clients/test';
import { DefaultSectionSearchTerms, Section, SectionSearchTerms } from '../../ww-commons';
import { Props, SectionsListLoader } from './SectionsListLoader';
import { SectionsStatus } from './types';

const query = LIST_SECTIONS;

// Seed a bit more so some are used to simulated stuff that will be used for updates
const SEED_COUNT = 5;
const INITIAL_COUNT = 3;
const PAGE_SIZE = 1;
const POLL_INTERVAL = 1000;
const TEST_REGION_ID = 'test_region_id';

let seedSections: Section[];
let seedCount: number;
let seedData: Result;
let mockedResponses: any[];
let wrapper: ReactWrapper<Props>;
let client: ApolloClient<any>;
const children = jest.fn(() => null);

const mockVariables = (offset = 0, limit = PAGE_SIZE, updatedAfter?: Date) => ({
  filter: { regionId: TEST_REGION_ID, updatedAfter },
  page: { limit, offset },
});

const mockResult = (offset: number, limit = PAGE_SIZE, count = INITIAL_COUNT) => ({
  data: {
    sections: {
      __typename: 'SectionsList',
      nodes: seedSections.slice(offset, offset + limit),
      count,
    },
  },
});

interface TestOptions extends Overwrite<FixedProviderOptions<Result, Vars>, {cache?: Result}> {
  isConnected?: boolean;
  searchTerms?: SectionSearchTerms;
  pollInterval?: number;
}

const mountInHarness = (options: TestOptions): any => {
  const { isConnected = true, searchTerms = null, pollInterval = 0, cache, ...opts } = options;
  const FixedProvider = createFixedProvider({
    ...opts,
    cache: cache && { query: LIST_SECTIONS, data: cache, variables: { filter: { regionId: TEST_REGION_ID} } },
  });
  // 1 item per page
  wrapper = mount(
    <SectionsListLoader
      region={{ node: { id: TEST_REGION_ID } }}
      searchTerms={searchTerms}
      isConnected={isConnected}
      client={FixedProvider.client}
      limit={PAGE_SIZE}
      pollInterval={pollInterval}
      children={children}
    />,
  );
  client = FixedProvider.client;
  return null;
};

beforeAll(async () => {
  const provider = createMockedProvider({
    mocks: {
      SectionsList: () => ({
        nodes: () => new MockList(SEED_COUNT),
        count: () => SEED_COUNT,
      }),
    },
  });
  const result = await provider.client.query<Result, Vars>({
    query: LIST_SECTIONS,
  });
  seedData = result.data;
  seedSections = seedData.sections.nodes!;
  seedCount = seedData.sections.count!;
  // This emulates server with pagination and filtering by date
  // Single link compares request query+variables and responds with result
  mockedResponses = [
    { request: {
       query: POLL_REGION_MEASUREMENTS,
       variables: { regionId: TEST_REGION_ID },
      },
      result: {
        data: {
          region: {
            __typename: 'Region',
            id: TEST_REGION_ID,
            gauges: {
              __typename: 'RegionGaugeConnection',
              nodes: [{
                __typename: 'Gauge',
                id: 'Gauge.id.1',
                lastMeasurement: {
                  __typename: 'Measurement',
                  flow: 300,
                  level: 300,
                  timestamp: new Date(2018, 1, 1).toISOString(),
                },
              }],
            },
          },
        },
      },
    }, // whole query
    {
      request: {
       query,
       variables: { filter: { regionId: TEST_REGION_ID} },
      },
      result: mockResult(0, 3),
    }, // whole query
    { request: { query, variables: mockVariables(0) }, result: mockResult(0) },
    { request: { query, variables: mockVariables(1) }, result: mockResult(1) },
    { request: { query, variables: mockVariables(2) }, result: mockResult(2) },
    { request: {
      query,
      variables: mockVariables(0, PAGE_SIZE, new Date(2017, 1, 4)) },
      result: mockResult(3, PAGE_SIZE, SEED_COUNT - INITIAL_COUNT),
    },
    { request: {
      query,
      variables: mockVariables(1, PAGE_SIZE, new Date(2017, 1, 4)) },
      result: mockResult(4, PAGE_SIZE, SEED_COUNT - INITIAL_COUNT),
    },
  ];
});

beforeEach(() => {
  jest.clearAllMocks().useRealTimers();
});

afterEach(() => {
  if (wrapper) {
    try {
      wrapper.unmount();
    } catch (e) {
      // ignore, unmounted in test
    }
  }
});

// safeguard against query/fragments changes
it('seed data should match schema', () => {
  expect(seedData).toMatchSnapshot();
});

it('should read result from cache first', async () => {
  await mountInHarness({
    cache: seedData,
    responses: [],
  });
  expect(children).nthCalledWith(1, expect.objectContaining({
    count: seedCount,
    status: SectionsStatus.READY,
    sections: seedSections,
  }));
});

it('should pass empty list first when cache is empty', async () => {
  await mountInHarness({
    responses: [],
  });

  expect(children).nthCalledWith(1, expect.objectContaining({
    count: 0,
    status: SectionsStatus.READY,
    sections: [],
  }));
});

it('should load initial data when cache contains no data', async () => {
  await mountInHarness({
    responses: mockedResponses,
  });
  await flushPromises(10);

  expect(children).lastCalledWith(expect.objectContaining({
    count: INITIAL_COUNT,
    status: SectionsStatus.READY,
    sections: seedSections.slice(0, INITIAL_COUNT),
  }));
});

it('should load initial data page by page', async () => {
  await mountInHarness({
    responses: mockedResponses,
  });
  await flushPromises(6);

  expect(children.mock.calls).toMatchObject([
    [{ count: 0, status: SectionsStatus.READY,   sections: [] }],
    [{ count: 0, status: SectionsStatus.LOADING, sections: [] }],
    [{ count: 3, status: SectionsStatus.LOADING, sections: seedSections.slice(0, 1) }],
    [{ count: 3, status: SectionsStatus.LOADING, sections: seedSections.slice(0, 2) }],
    [{ count: 3, status: SectionsStatus.LOADING, sections: seedSections.slice(0, 3) }],
    [{ count: 3, status: SectionsStatus.READY,   sections: seedSections.slice(0, 3) }],
  ]);
});

it('should continue loading initial data when cache contains partial data', async () => {
  await mountInHarness({
    cache: { sections: { __typename: 'SectionsList', count: INITIAL_COUNT, nodes: seedSections.slice(0, 2) } },
    responses: mockedResponses,
  });

  await flushPromises(6);

  expect(children.mock.calls).toMatchObject([
    [{ count: 3, status: SectionsStatus.READY, sections: seedSections.slice(0, 2) }],
    [{ count: 3, status: SectionsStatus.LOADING, sections: seedSections.slice(0, 2) }],
    [{ count: 3, status: SectionsStatus.LOADING, sections: seedSections.slice(0, 3) }],
    [{ count: 3, status: SectionsStatus.READY,   sections: seedSections.slice(0, 3) }],
  ]);
});

it('should load updates page by page when cache is full', async () => {
  await mountInHarness({
    cache: { sections: { __typename: 'SectionsList', count: INITIAL_COUNT, nodes: seedSections.slice(0, 3) } },
    responses: mockedResponses,
  });

  await flushPromises(6);

  expect(children.mock.calls).toMatchObject([
    [{ sections: seedSections.slice(0, 3) }],
    [{ sections: seedSections.slice(0, 3) }],
    [{ sections: seedSections.slice(0, 4) }],
    [{ sections: seedSections.slice(0, 5) }],
    [{ sections: seedSections.slice(0, 5) }],
  ]);
});

it('should change status while loading updates', async () => {
  await mountInHarness({
    cache: { sections: { __typename: 'SectionsList', count: INITIAL_COUNT, nodes: seedSections.slice(0, 3) } },
    responses: mockedResponses,
  });

  await flushPromises(10);

  expect(children.mock.calls).toMatchObject([
    [{ status: SectionsStatus.READY }],
    [{ status: SectionsStatus.LOADING_UPDATES }],
    [{ status: SectionsStatus.LOADING_UPDATES }],
    [{ status: SectionsStatus.LOADING_UPDATES }],
    [{ status: SectionsStatus.READY }],
  ]);
});

it('should update count after loading updates', async () => {
  await mountInHarness({
    cache: { sections: { __typename: 'SectionsList', count: INITIAL_COUNT, nodes: seedSections.slice(0, 3) } },
    responses: mockedResponses,
  });

  await flushPromises(10);

  expect(children.mock.calls).toMatchObject([
    [{ count: 3 }],
    [{ count: 3 }],
    [{ count: 4 }],
    [{ count: 5 }],
    [{ count: 5 }],
  ]);
});

it('should not try to load anything when offline', async () => {
  const spy = jest.spyOn(MockLink.prototype, 'request');
  await mountInHarness({
    isConnected: false,
    responses: mockedResponses,
  });

  await flushPromises(10);

  expect(spy).not.toBeCalled();
});

it('should render cache while offline', async () => {
  await mountInHarness({
    cache: { sections: { __typename: 'SectionsList', count: INITIAL_COUNT, nodes: seedSections.slice(0, 2) } },
    responses: mockedResponses,
    isConnected: false,
  });

  await flushPromises(10);

  expect(children).toHaveBeenLastCalledWith(expect.objectContaining({
    status: SectionsStatus.READY,
    count: INITIAL_COUNT,
    sections: seedSections.slice(0, 2),
  }));
});

it('should catch up after coming back online', async () => {
  await mountInHarness({
    cache: { sections: { __typename: 'SectionsList', count: INITIAL_COUNT, nodes: seedSections.slice(0, 2) } },
    responses: mockedResponses,
    isConnected: false,
  });

  await flushPromises(10);
  wrapper.setProps({ isConnected: true });
  await flushPromises(10);

  expect(children).lastCalledWith(expect.objectContaining({
    status: SectionsStatus.READY,
    count: INITIAL_COUNT,
    sections: seedSections.slice(0, INITIAL_COUNT),
  }));
});

it('should release subscription when unmounted', async () => {
  await mountInHarness({
    responses: mockedResponses,
  });
  const spy = jest.spyOn(MockLink.prototype, 'request');
  wrapper.unmount();
  await flushPromises(10);
  // initial call when subscribing to query
  expect(spy).toHaveBeenCalledTimes(1);
});

it('should poll lastMeasurements', async () => {
  jest.useFakeTimers();
  await mountInHarness({
    responses: mockedResponses,
    pollInterval: POLL_INTERVAL,
  });
  await flushPromises(10);
  const spy = jest.spyOn(MockLink.prototype, 'request');
  jest.runTimersToTime(POLL_INTERVAL * 2.5);
  expect(spy).toHaveBeenLastCalledWith(expect.objectContaining({
    operationName: 'pollRegionMeasurements',
    variables: { regionId: TEST_REGION_ID },
  }));
});

it('should poll lastMeasurements after coming back online', async () => {
  jest.useFakeTimers();
  await mountInHarness({
    cache: { sections: { __typename: 'SectionsList', count: INITIAL_COUNT, nodes: seedSections.slice(0, 2) } },
    responses: mockedResponses,
    isConnected: false,
    pollInterval: POLL_INTERVAL,
  });
  await flushPromises(10);
  wrapper.setProps({ isConnected: true });
  await flushPromises(10);
  const spy = jest.spyOn(MockLink.prototype, 'request');
  jest.runTimersToTime(POLL_INTERVAL * 2.5);
  expect(spy).toHaveBeenLastCalledWith(expect.objectContaining({
    operationName: 'pollRegionMeasurements',
    variables: { regionId: TEST_REGION_ID },
  }));
});

it('should pass lastMeasurements updated via poll', async () => {
  jest.useFakeTimers();
  await mountInHarness({
    responses: mockedResponses,
    pollInterval: POLL_INTERVAL,
  });
  await flushPromises(10);
  jest.runTimersToTime(POLL_INTERVAL * 2.5);
  await flushPromises(10);
  expect(children.mock.calls.pop())
    .toHaveProperty('0.sections.0.gauge.lastMeasurement.flow', 300);
});

it('should pass lastMeasurements updated via poll after coming back online', async () => {
  jest.useFakeTimers();
  await mountInHarness({
    cache: { sections: { __typename: 'SectionsList', count: INITIAL_COUNT, nodes: seedSections.slice(0, 2) } },
    responses: mockedResponses,
    isConnected: false,
    pollInterval: POLL_INTERVAL,
  });
  await flushPromises(10);
  wrapper.setProps({ isConnected: true });
  await flushPromises(10);
  jest.runTimersToTime(POLL_INTERVAL * 2.5);
  await flushPromises(10);
  expect(children.mock.calls.pop())
    .toHaveProperty('0.sections.0.gauge.lastMeasurement.flow', 300);
});

it('should pass updates when is changed outside the query', async () => {
  await mountInHarness({
    responses: mockedResponses,
    pollInterval: POLL_INTERVAL,
  });
  await flushPromises(10);
  client.writeFragment({
    data: { __typename: 'Section', id: 'Section.id.1', difficulty: 9 },
    id: dataIdFromObject({ __typename: 'Section', id: 'Section.id.1' })!,
    fragment: gql`
      fragment testFrag on Section {
        id
        difficulty
      }
    `,
  });
  await flushPromises(10);
  expect(children.mock.calls.pop())
    .toHaveProperty('0.sections.0.difficulty', 9);
});

it('should apply filters', async () => {
  await mountInHarness({
    responses: mockedResponses,
    searchTerms: {
      ...DefaultSectionSearchTerms,
      difficulty: [2.1, 2.9],
      duration: [0, 1000],
    },
  });
  await flushPromises(10);
  expect(children).lastCalledWith(expect.objectContaining({
    sections: [expect.anything()],
    count: INITIAL_COUNT,
  }));
});

it('should load updates on refresh', async () => {
  await mountInHarness({
    responses: mockedResponses,
  });
  await flushPromises(10);
  const spy = jest.spyOn(MockLink.prototype, 'request');
  const props: any = children.mock.calls[children.mock.calls.length - 1];
  await props[0].refresh();
  expect(spy).toHaveBeenLastCalledWith(expect.objectContaining({
    operationName: 'listSections',
    variables: { filter: { regionId: TEST_REGION_ID, updatedAfter: expect.any(Date) }, page: { offset: 1, limit: 1} },
  }));
});

it('should not load updates when already loading', async () => {
  await mountInHarness({
    responses: mockedResponses,
  });
  await flushPromises(1);
  const spy = jest.spyOn(MockLink.prototype, 'request');
  const props: any = children.mock.calls[children.mock.calls.length - 1];
  await props[0].refresh();
  expect(spy).not.toHaveBeenCalledWith(expect.objectContaining({
    operationName: 'listSections',
    variables: { filter: { regionId: TEST_REGION_ID, updatedAfter: expect.any(Date) }, page: expect.anything() },
  }));
  await flushPromises();
});
