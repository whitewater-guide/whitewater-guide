import { GraphQLResolveInfo } from 'graphql';
import gqf from 'graphql-fields';
import db from '../../db';
import { adminContext } from '../../test/context';
import { buildRegionQuery, buildRegionsListQuery } from './queryBuilder';

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
  it('should build correct query without connections', () => {
    graphqlFields.mockReturnValueOnce(primitives);
    const query = buildRegionQuery(options);
    expect(query).toMatchSnapshot();
  });

  it('should build correct query with rivers connection', () => {
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
    graphqlFields.mockReturnValueOnce({ ...primitives, ...connections });
    const query = buildRegionQuery(options);
    expect(query).toMatchSnapshot();
  });

  it('should build correct query with gauges connection', () => {
    const connections = {
      gauges: {
        nodes: {
          __typename: {},
          id: {},
          language: {},
          name: {},
        },
        count: {},
      },
    };
    graphqlFields.mockReturnValueOnce({ ...primitives, ...connections });
    const query = buildRegionQuery(options);
    expect(query).toMatchSnapshot();
  });

  it('should build correct query with sections connection', () => {
    const connections = {
      sections: {
        nodes: {
          __typename: {},
          id: {},
          language: {},
          name: {},
        },
        count: {},
      },
    };
    graphqlFields.mockReturnValueOnce({ ...primitives, ...connections });
    const query = buildRegionQuery(options);
    expect(query).toMatchSnapshot();
  });
});

describe('list', () => {
  it('should build correct query without connections', () => {
    graphqlFields.mockReturnValueOnce({ nodes: primitives, count: {} });
    const query = buildRegionsListQuery(options);
    expect(query).toMatchSnapshot();
  });

  it('should build correct query with rivers connection', () => {
    const connections = {
      rivers: {
        count: {},
      },
    };
    graphqlFields.mockReturnValueOnce({ nodes: { ...primitives, ...connections }, count: {} });
    const query = buildRegionsListQuery(options);
    expect(query).toMatchSnapshot();
  });

  it('should build correct query with gauges connection', () => {
    const connections = {
      gauges: {
        count: {},
      },
    };
    graphqlFields.mockReturnValueOnce({ nodes: { ...primitives, ...connections }, count: {} });
    const query = buildRegionsListQuery(options);
    expect(query).toMatchSnapshot();
  });

  it('should build correct query with sections connection', () => {
    const connections = {
      sections: {
        count: {},
      },
    };
    graphqlFields.mockReturnValueOnce({ nodes: { ...primitives, ...connections }, count: {} });
    const query = buildRegionsListQuery(options);
    expect(query).toMatchSnapshot();
  });
});
