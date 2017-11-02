import { GraphQLResolveInfo } from 'graphql';
import db from '../../db';
import { adminContext } from '../../test/context';
import { buildRegionQuery, buildRegionsListQuery } from './queryBuilder';
import gqf = require('graphql-fields');

const graphqlFields: jest.Mock<any> = gqf as any;
jest.mock('graphql-fields', () => jest.fn());

const primitives = {
  __typename: {},
  id: {},
  language: {},
  name: {},
  description: {},
  season: {},
  seasonNumeric: {},
  bounds: {},
  pois: {},
  hidden: {},
  createdAt: {},
  updatedAt: {},
};

const info: GraphQLResolveInfo = {} as any;

const options = { info, context: adminContext, knex: db(true) };

describe('details', () => {
  const connections = {
    rivers: {
      nodes: {
        __typename: {},
        id: {},
        language: {},
        name: {},
      },
      count: {},
    },
  };

  it('should build correct query without connections', () => {
    graphqlFields.mockReturnValueOnce(primitives);
    const query = buildRegionQuery(options);
    expect(query).toMatchSnapshot();
  });

  it('should build correct query with connections', () => {
    graphqlFields.mockReturnValueOnce({ ...primitives, ...connections });
    const query = buildRegionQuery(options);
    expect(query).toMatchSnapshot();
  });
});

describe('list', () => {
  const connections = {
    rivers: {
      count: {},
    },
  };

  it('should build correct query without connections', () => {
    graphqlFields.mockReturnValueOnce({ nodes: primitives, count: {} });
    const query = buildRegionsListQuery(options);
    expect(query).toMatchSnapshot();
  });

  it('should build correct query with connections', () => {
    graphqlFields.mockReturnValueOnce({ nodes: { ...primitives, ...connections }, count: {} });
    const query = buildRegionsListQuery(options);
    expect(query).toMatchSnapshot();
  });
});
