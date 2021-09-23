import { ApolloClient } from '@apollo/client';
import { MockedResponse } from '@apollo/client/testing';
import { MockList } from '@graphql-tools/mock';
import FakeTimers from '@sinonjs/fake-timers';
import { act, render, RenderResult, waitFor } from '@testing-library/react';
import gql from 'graphql-tag';
import React from 'react';
import { Overwrite } from 'utility-types';

import {
  createFixedProvider,
  FixedProviderOptions,
  mockApolloProvider,
} from '../../test';
import { PollRegionMeasurementsDocument } from '../regions';
import {
  ListSectionsDocument,
  ListSectionsQuery,
  ListSectionsQueryVariables,
} from './listSections.generated';
import { SectionsListProvider } from './SectionsListProvider';
import {
  DefaultSectionFilterOptions,
  SectionFilterOptions,
  SectionsStatus,
} from './types';

type Props = React.ComponentProps<typeof SectionsListProvider>;

const query = ListSectionsDocument;

// Seed a bit more so some are used to simulated stuff that will be used for updates
const SEED_COUNT = 5;
const INITIAL_COUNT = 3;
const PAGE_SIZE = 1;
const POLL_INTERVAL = 1000;
const TEST_REGION_ID = 'test_region_id';
const ERROR_REGION_ID = 'error_region_id';
const ERROR_WITH_DATA_REGION_ID = 'error_with_data_region_id';

let seedSections: ListSectionsQuery['sections']['nodes'];
let seedCount: number;
let seedData: ListSectionsQuery;
let mockedResponses: MockedResponse[];

const mockVariables = (
  offset = 0,
  limit = PAGE_SIZE,
  updatedAfter?: Date,
): ListSectionsQueryVariables => ({
  filter: {
    regionId: TEST_REGION_ID,
    updatedAfter: updatedAfter?.toISOString(),
  },
  page: { limit, offset },
});

const mockResult = (
  offset: number,
  limit = PAGE_SIZE,
  count = INITIAL_COUNT,
) => ({
  data: {
    sections: {
      __typename: 'SectionsList',
      nodes: seedSections.slice(offset, offset + limit),
      count,
    },
  },
});

interface TestOptions
  extends Overwrite<
    FixedProviderOptions<ListSectionsQuery, ListSectionsQueryVariables>,
    { cache?: ListSectionsQuery }
  > {
  isConnected?: boolean;
  filterOptions?: SectionFilterOptions;
  pollInterval?: number;
  regionId?: string;
}

interface Harness {
  update: (props: Partial<Props>) => Promise<void>;
  unmount: () => void;
  children: jest.Mock;
  client: ApolloClient<any>;
  requestSpy: jest.SpyInstance;
}

const mountInHarness = async (options: TestOptions): Promise<Harness> => {
  const {
    isConnected = true,
    filterOptions = null,
    pollInterval = 0,
    cache,
    regionId = TEST_REGION_ID,
    ...opts
  } = options;
  const FixedProvider = createFixedProvider({
    ...opts,
    cache: cache && {
      query,
      data: cache,
      variables: { filter: { regionId } },
    },
  });
  const requestSpy = jest.spyOn(FixedProvider.client.link, 'request');
  let wrapper: RenderResult | undefined;
  const children = jest.fn(() => null);
  // 1 item per page
  await act(async () => {
    wrapper = render(
      <SectionsListProvider
        key="test_sections_list_loader"
        regionId={regionId}
        filterOptions={filterOptions}
        isConnected={isConnected}
        client={FixedProvider.client}
        limit={PAGE_SIZE}
        pollInterval={pollInterval}
      >
        {children}
      </SectionsListProvider>,
    );
  });
  return {
    unmount: () => {
      wrapper?.unmount();
    },
    client: FixedProvider.client,
    requestSpy,
    children,
    update: async (props) => {
      await act(async () => {
        await wrapper?.rerender(
          <SectionsListProvider
            key="test_sections_list_loader"
            regionId={regionId}
            filterOptions={filterOptions}
            isConnected={isConnected}
            client={FixedProvider.client}
            limit={PAGE_SIZE}
            pollInterval={pollInterval}
            {...props}
          >
            {children}
          </SectionsListProvider>,
        );
      });
    },
  };
};

const mockPolledResponse = (n: number): MockedResponse => ({
  request: {
    query: PollRegionMeasurementsDocument,
    variables: { regionId: TEST_REGION_ID },
  },
  result: {
    data: {
      region: {
        __typename: 'Region',
        id: TEST_REGION_ID,
        gauges: {
          __typename: 'RegionGaugeConnection',
          nodes: [
            {
              __typename: 'Gauge',
              id: 'Gauge.id.1',
              latestMeasurement: {
                __typename: 'Measurement',
                flow: 300 + n,
                level: 300 + n,
                timestamp: new Date(2018, n, 1).toISOString(),
              },
            },
          ],
        },
      },
    },
  },
});

beforeAll(async () => {
  const provider = mockApolloProvider({
    mocks: {
      SectionsList: () => ({
        nodes: () => new MockList(SEED_COUNT),
        count: () => SEED_COUNT,
      }),
    },
  });
  const result = await provider.client.query<
    ListSectionsQuery,
    ListSectionsQueryVariables
  >({
    query,
  });
  seedData = result.data;
  seedSections = seedData.sections.nodes;
  seedCount = seedData.sections.count;
  // This emulates server with pagination and filtering by date
  // Single link compares request query+variables and responds with result
  mockedResponses = [
    mockPolledResponse(0),
    mockPolledResponse(1),
    mockPolledResponse(2),
    {
      request: {
        query,
        variables: { filter: { regionId: TEST_REGION_ID } },
      },
      result: mockResult(0, 3),
    }, // whole query
    { request: { query, variables: mockVariables(0) }, result: mockResult(0) },
    { request: { query, variables: mockVariables(1) }, result: mockResult(1) },
    { request: { query, variables: mockVariables(2) }, result: mockResult(2) },
    {
      request: {
        query,
        variables: mockVariables(0, PAGE_SIZE, new Date(2017, 1, 4)),
      },
      result: mockResult(3, PAGE_SIZE, SEED_COUNT - INITIAL_COUNT),
    },
    {
      request: {
        query,
        variables: mockVariables(1, PAGE_SIZE, new Date(2017, 1, 4)),
      },
      result: mockResult(4, PAGE_SIZE, SEED_COUNT - INITIAL_COUNT),
    },
    {
      request: {
        query,
        variables: {
          page: { limit: 1, offset: 0 },
          filter: { regionId: ERROR_REGION_ID, updatedAfter: undefined },
        },
      },
      error: {
        message: 'fubar',
        name: 'error_foobar',
      },
    },
    {
      request: {
        query,
        variables: {
          page: { limit: 1, offset: 0 },
          filter: {
            regionId: ERROR_WITH_DATA_REGION_ID,
            updatedAfter: undefined,
          },
        },
      },
      result: mockResult(0, 1, 2),
    },
    {
      request: {
        query,
        variables: {
          page: { limit: 1, offset: 1 },
          filter: {
            regionId: ERROR_WITH_DATA_REGION_ID,
            updatedAfter: undefined,
          },
        },
      },
      error: {
        message: 'fubar',
        name: 'error_foobar',
      },
    },
  ];
});

beforeEach(() => {
  jest.resetAllMocks();
});

// safeguard against query/fragments changes
it('seed data should match schema', () => {
  expect(seedData).toMatchSnapshot();
});

it('should read result from cache first', async () => {
  const harness = await mountInHarness({
    cache: seedData,
    responses: [],
  });
  expect(harness.children).nthCalledWith(
    1,
    expect.objectContaining({
      count: seedCount,
      status: SectionsStatus.READY,
      sections: seedSections,
    }),
  );
});

it('should pass empty list first when cache is empty', async () => {
  const harness = await mountInHarness({
    responses: [],
  });

  expect(harness.children).toHaveBeenCalledWith(
    expect.objectContaining({
      count: 0,
      status: SectionsStatus.READY,
      sections: null,
    }),
  );
});

it('should load initial data when cache contains no data', async () => {
  const harness = await mountInHarness({
    responses: mockedResponses,
  });

  await waitFor(() => {
    expect(harness.children).lastCalledWith(
      expect.objectContaining({
        count: INITIAL_COUNT,
        status: SectionsStatus.READY,
        sections: seedSections.slice(0, INITIAL_COUNT),
      }),
    );
  });
});

it('should load initial data page by page', async () => {
  const harness = await mountInHarness({
    responses: mockedResponses,
  });

  await waitFor(() =>
    expect(harness.children.mock.calls).toMatchObject([
      [{ count: 0, status: SectionsStatus.READY, sections: null }],
      [{ count: 0, status: SectionsStatus.LOADING, sections: null }],
      [
        {
          count: 3,
          status: SectionsStatus.LOADING,
          sections: seedSections.slice(0, 1),
        },
      ],
      [
        {
          count: 3,
          status: SectionsStatus.LOADING,
          sections: seedSections.slice(0, 2),
        },
      ],
      [
        {
          count: 3,
          status: SectionsStatus.LOADING,
          sections: seedSections.slice(0, 3),
        },
      ],
      [
        {
          count: 3,
          status: SectionsStatus.READY,
          sections: seedSections.slice(0, 3),
        },
      ],
    ]),
  );
});

it('should continue loading initial data when cache contains partial data', async () => {
  const harness = await mountInHarness({
    cache: {
      sections: {
        __typename: 'SectionsList',
        count: INITIAL_COUNT,
        nodes: seedSections.slice(0, 2),
      },
    },
    responses: mockedResponses,
  });

  await waitFor(() =>
    expect(harness.children.mock.calls).toMatchObject([
      [
        {
          count: 3,
          status: SectionsStatus.READY,
          sections: seedSections.slice(0, 2),
        },
      ],
      [
        {
          count: 3,
          status: SectionsStatus.LOADING,
          sections: seedSections.slice(0, 2),
        },
      ],
      [
        {
          count: 3,
          status: SectionsStatus.LOADING,
          sections: seedSections.slice(0, 3),
        },
      ],
      [
        {
          count: 3,
          status: SectionsStatus.READY,
          sections: seedSections.slice(0, 3),
        },
      ],
    ]),
  );
});

it('should load updates page by page when cache is full', async () => {
  const harness = await mountInHarness({
    cache: {
      sections: {
        __typename: 'SectionsList',
        count: INITIAL_COUNT,
        nodes: seedSections.slice(0, 3),
      },
    },
    responses: mockedResponses,
  });

  await waitFor(() => {
    expect(harness.children.mock.calls).toMatchObject([
      [{ sections: seedSections.slice(0, 3) }],
      [{ sections: seedSections.slice(0, 3) }],
      [{ sections: seedSections.slice(0, 4) }],
      [{ sections: seedSections.slice(0, 5) }],
      [{ sections: seedSections.slice(0, 5) }],
    ]);
  });
});

it('should change status while loading updates', async () => {
  const harness = await mountInHarness({
    cache: {
      sections: {
        __typename: 'SectionsList',
        count: INITIAL_COUNT,
        nodes: seedSections.slice(0, 3),
      },
    },
    responses: mockedResponses,
  });

  await waitFor(() =>
    expect(harness.children.mock.calls).toMatchObject([
      [{ status: SectionsStatus.READY }],
      [{ status: SectionsStatus.LOADING_UPDATES }],
      [{ status: SectionsStatus.LOADING_UPDATES }],
      [{ status: SectionsStatus.LOADING_UPDATES }],
      [{ status: SectionsStatus.READY }],
    ]),
  );
});

it('should update count after loading updates', async () => {
  const harness = await mountInHarness({
    cache: {
      sections: {
        __typename: 'SectionsList',
        count: INITIAL_COUNT,
        nodes: seedSections.slice(0, 3),
      },
    },
    responses: mockedResponses,
  });

  await waitFor(() =>
    expect(harness.children.mock.calls).toMatchObject([
      [{ count: 3 }],
      [{ count: 3 }],
      [{ count: 4 }],
      [{ count: 5 }],
      [{ count: 5 }],
    ]),
  );
});

it('should not try to load anything when offline', async () => {
  const harness = await mountInHarness({
    isConnected: false,
    responses: mockedResponses,
  });

  expect(harness.requestSpy).not.toBeCalled();
});

it('should render cache while offline', async () => {
  const harness = await mountInHarness({
    cache: {
      sections: {
        __typename: 'SectionsList',
        count: INITIAL_COUNT,
        nodes: seedSections.slice(0, 2),
      },
    },
    responses: mockedResponses,
    isConnected: false,
  });

  expect(harness.children).toHaveBeenLastCalledWith(
    expect.objectContaining({
      status: SectionsStatus.READY,
      count: INITIAL_COUNT,
      sections: seedSections.slice(0, 2),
    }),
  );
});

it('should catch up after coming back online', async () => {
  const harness = await mountInHarness({
    cache: {
      sections: {
        __typename: 'SectionsList',
        count: INITIAL_COUNT,
        nodes: seedSections.slice(0, 2),
      },
    },
    responses: mockedResponses,
    isConnected: false,
  });

  await harness.update({ isConnected: true });

  await waitFor(() =>
    expect(harness.children).lastCalledWith(
      expect.objectContaining({
        status: SectionsStatus.READY,
        count: INITIAL_COUNT,
        sections: seedSections.slice(0, INITIAL_COUNT),
      }),
    ),
  );
});

it('should release subscription when unmounted', async () => {
  const harness = await mountInHarness({
    responses: mockedResponses,
  });
  act(() => {
    harness.unmount();
  });
  // initial call when subscribing to query
  expect(harness.requestSpy).toHaveBeenCalledTimes(1);
});

it('should fire polling query immediately', async () => {
  const clock = FakeTimers.install();

  const harness = await mountInHarness({
    responses: mockedResponses,
    pollInterval: POLL_INTERVAL,
  });

  await clock.tickAsync(POLL_INTERVAL * 0.5);
  // unwind to point before before first interval
  expect(harness.requestSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({
      operationName: 'pollRegionMeasurements',
      variables: { regionId: TEST_REGION_ID },
    }),
  );

  clock.uninstall();
});

it('should continuously poll latestMeasurements', async () => {
  const clock = FakeTimers.install();

  const harness = await mountInHarness({
    responses: mockedResponses,
    pollInterval: POLL_INTERVAL,
  });
  await clock.tickAsync(POLL_INTERVAL * 2.5);

  const pollCount = harness.requestSpy.mock.calls.filter(
    ([op]) => op.operationName === 'pollRegionMeasurements',
  ).length;
  expect(pollCount).toBe(3);

  clock.uninstall();
});

it.each([
  ['partial data', 2],
  ['full data', INITIAL_COUNT],
])(
  'should poll latestMeasurements after coming back online with %s',
  async (_: any, len: number) => {
    const clock = FakeTimers.install();

    const harness = await mountInHarness({
      cache: {
        sections: {
          __typename: 'SectionsList',
          count: INITIAL_COUNT,
          nodes: seedSections.slice(0, len),
        },
      },
      responses: mockedResponses,
      isConnected: false,
      pollInterval: POLL_INTERVAL,
    });

    await harness.update({ isConnected: true });
    await clock.tickAsync(POLL_INTERVAL * 2.5);

    const pollCount = harness.requestSpy.mock.calls.filter(
      ([op]) => op.operationName === 'pollRegionMeasurements',
    ).length;
    expect(pollCount).toBe(3);

    clock.uninstall();
  },
);

it('should pass latestMeasurements updated via poll', async () => {
  const clock = FakeTimers.install();

  const harness = await mountInHarness({
    responses: mockedResponses,
    pollInterval: POLL_INTERVAL,
  });

  await clock.tickAsync(POLL_INTERVAL * 2.2);

  expect(harness.children.mock.calls.pop()).toHaveProperty(
    '0.sections.0.gauge.latestMeasurement.flow',
    302,
  );
  expect(harness.children.mock.calls.pop()).toHaveProperty(
    '0.sections.0.gauge.latestMeasurement.flow',
    301,
  );
  expect(harness.children.mock.calls.pop()).toHaveProperty(
    '0.sections.0.gauge.latestMeasurement.flow',
    300,
  );

  clock.uninstall();
});

it('should pass latestMeasurements updated via poll after coming back online', async () => {
  const clock = FakeTimers.install();

  const harness = await mountInHarness({
    cache: {
      sections: {
        __typename: 'SectionsList',
        count: INITIAL_COUNT,
        nodes: seedSections.slice(0, 2),
      },
    },
    responses: mockedResponses,
    isConnected: false,
    pollInterval: POLL_INTERVAL,
  });

  await harness.update({ isConnected: true });
  await clock.tickAsync(POLL_INTERVAL * 2.5);

  expect(harness.children.mock.calls.pop()).toHaveProperty(
    '0.sections.0.gauge.latestMeasurement.flow',
    302,
  );

  clock.uninstall();
});

it('should pass updates when is changed outside the query', async () => {
  const harness = await mountInHarness({
    responses: mockedResponses,
  });

  // wait till initial loading is complete
  await waitFor(() => {
    expect(harness.children).toHaveBeenCalledWith(
      expect.objectContaining({ count: 3, status: SectionsStatus.READY }),
    );
  });

  act(() => {
    harness.client.writeFragment({
      data: { __typename: 'Section', id: 'Section.id.1', difficulty: 9 },
      id: 'Section:Section.id.1',
      fragment: gql`
        fragment testFrag on Section {
          id
          difficulty
        }
      `,
    });
  });

  // Force rerender
  await harness.update({ key: 'test_sections_list_loader2' } as any);

  await waitFor(() => {
    const diff = harness.children.mock.calls.find(([arg]: any) =>
      (arg.sections ?? []).some((s: any) => s.difficulty === 9),
    );
    expect(diff).toBeDefined();
  });
});

it('should apply filters', async () => {
  const harness = await mountInHarness({
    responses: mockedResponses,
    filterOptions: {
      ...DefaultSectionFilterOptions,
      difficulty: [2.1, 2.9],
      duration: [0, 1000],
    },
  });
  await waitFor(() => {
    expect(harness.children).lastCalledWith(
      expect.objectContaining({
        sections: [expect.anything()],
        count: INITIAL_COUNT,
      }),
    );
  });
});

it('should load updates on refresh', async () => {
  const harness = await mountInHarness({
    responses: mockedResponses,
  });

  // wait till initial loading is complete
  await waitFor(() => {
    expect(harness.children).toHaveBeenCalledWith(
      expect.objectContaining({ count: 3, status: SectionsStatus.READY }),
    );
  });

  const props: any =
    harness.children.mock.calls[harness.children.mock.calls.length - 1];
  await act(async () => props[0].refresh());

  expect(harness.requestSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({
      operationName: 'listSections',
      variables: {
        filter: {
          regionId: TEST_REGION_ID,
          updatedAfter: new Date(2017, 1, 4).toISOString(),
        },
        page: { offset: 1, limit: 1 },
      },
    }),
  );
});

it('should not load updates when already loading', async () => {
  const harness = await mountInHarness({
    responses: mockedResponses,
  });
  // wait till in loading state
  await waitFor(() => {
    expect(harness.children).toHaveBeenCalledWith(
      expect.objectContaining({ status: SectionsStatus.LOADING }),
    );
  });

  const props: any =
    harness.children.mock.calls[harness.children.mock.calls.length - 1];
  await act(async () => props[0].refresh());
  expect(harness.requestSpy).not.toHaveBeenCalledWith(
    expect.objectContaining({
      operationName: 'listSections',
      variables: {
        filter: {
          regionId: TEST_REGION_ID,
          updatedAfter: expect.stringContaining('2017'),
        },
        page: expect.anything(),
      },
    }),
  );
});

it('should provide null sections and error when error happens with no data', async () => {
  const harness = await mountInHarness({
    responses: mockedResponses,
    regionId: ERROR_REGION_ID,
  });

  await waitFor(() => {
    expect(harness.children).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.any(Error),
        status: SectionsStatus.READY,
      }),
    );
  });
});

it('should provide some sections and error when error happens with data', async () => {
  const harness = await mountInHarness({
    responses: mockedResponses,
    regionId: ERROR_WITH_DATA_REGION_ID,
  });

  await waitFor(() => {
    expect(harness.children).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.any(Error),
        sections: expect.any(Array),
        count: 2,
        status: SectionsStatus.READY,
      }),
    );
  });
});
