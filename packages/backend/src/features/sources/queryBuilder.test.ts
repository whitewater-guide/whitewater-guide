import { GraphQLResolveInfo } from 'graphql';
import gqf from 'graphql-fields';
import db from '../../db';
import { EDITOR_GA_EC } from '../../seeds/test/01_users';
import { fakeContext } from '../../test/context';
import { buildQuery, buildSourcesListQuery } from './queryBuilder';

const graphqlFields: jest.Mock<any> = gqf as any;
jest.mock('graphql-fields', () => jest.fn());

const primitives = {
  __typename: {},
  id: {},
  name: {},
  url: {},
  script: {},
  harvestMode: {},
  cron: {},
  enabled: {},
  createdAt: {},
  updatedAt: {},
};

const info: GraphQLResolveInfo = {} as any;

const options = { info, context: fakeContext(EDITOR_GA_EC), knex: db(true) };

describe('details', () => {
  const connections = {
    regions: {
      nodes: {
        __typename: {},
        id: {},
        name: {},
      },
      count: {},
    },
    gauges: {
      nodes: {
        __typename: {},
        id: {},
        name: {},
      },
      count: {},
    },
  };

  it('should build correct query without connections', () => {
    graphqlFields.mockReturnValueOnce(primitives);
    const query = buildQuery(options);
    expect(query).toMatchSnapshot();
  });

  it('should build correct query with connections', () => {
    graphqlFields.mockReturnValueOnce({ ...primitives, ...connections });
    const query = buildQuery(options);
    expect(query).toMatchSnapshot();
  });
});

describe('list', () => {
  const connections = {
    regions: {
      nodes: {
        __typename: {},
        id: {},
        name: {},
      },
      count: {},
    },
    gauges: {
      count: {},
    },
  };

  it('should build correct query without connections', () => {
    graphqlFields.mockReturnValueOnce({ nodes: primitives, count: {} });
    const query = buildSourcesListQuery(options);
    expect(query).toMatchSnapshot();
  });

  it('should build correct query with connections', () => {
    graphqlFields.mockReturnValueOnce({ nodes: { ...primitives, ...connections }, count: {} });
    const query = buildSourcesListQuery(options);
    expect(query).toMatchSnapshot();
  });
});
