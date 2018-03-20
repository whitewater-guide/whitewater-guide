import { GraphQLResolveInfo } from 'graphql';
import gqf from 'graphql-fields';
import db from '../../db';
import { adminContext } from '../../test/context';
import { buildSectionQuery, buildSectionsListQuery } from './queryBuilder';

const graphqlFields: jest.Mock<any> = gqf as any;
jest.mock('graphql-fields', () => jest.fn());

const minPrimitives = {
  __typename: {},
  id: {},
  language: {},
  name: {},
};

const allPrimitives = {
  ...minPrimitives,
  description: {},
  season: {},
  seasonNumeric: {},
  levels: {},
  flows: {},
  flowsText: {},
  putIn: {},
  takeOut: {},
  shape: {},
  distance: {},
  drop: {},
  duration: {},
  difficulty: {},
  difficultyXtra: {},
  rating: {},
  tags: {},
  createdAt: {},
  updatedAt: {},
  pois: {},
};

const media = {
  nodes: {
    __typename: {},
    id: {},
    language: {},
    url: {},
  },
  count: {},
};

const info: GraphQLResolveInfo = {} as any;

const options = { info, context: adminContext, knex: db(true) };

describe('details', () => {
  it('should build correct query without connections', () => {
    graphqlFields.mockReturnValueOnce(allPrimitives);
    const query = buildSectionQuery(options);
    expect(query).toMatchSnapshot();
  });

  it('should build correct query with river', () => {
    graphqlFields.mockReturnValueOnce({ ...minPrimitives, river: minPrimitives });
    const query = buildSectionQuery(options);
    expect(query).toMatchSnapshot();
  });

  it('should build correct query with gauge', () => {
    graphqlFields.mockReturnValueOnce({ ...minPrimitives, gauge: minPrimitives });
    const query = buildSectionQuery(options);
    expect(query).toMatchSnapshot();
  });

  it('should build correct query with region', () => {
    graphqlFields.mockReturnValueOnce({ ...minPrimitives, region: minPrimitives });
    const query = buildSectionQuery(options);
    expect(query).toMatchSnapshot();
  });

  it('should build correct query with media', () => {
    graphqlFields.mockReturnValueOnce({ ...minPrimitives, media });
    const query = buildSectionQuery(options);
    expect(query).toMatchSnapshot();
  });
});

describe('list', () => {
  it('should build correct query without connections', () => {
    graphqlFields.mockReturnValueOnce({ nodes: allPrimitives, count: {} });
    const query = buildSectionsListQuery(options);
    expect(query).toMatchSnapshot();
  });

  it('should build correct query with river', () => {
    graphqlFields.mockReturnValueOnce({ nodes: { ...minPrimitives, river: minPrimitives }, count: {} });
    const query = buildSectionsListQuery(options);
    expect(query).toMatchSnapshot();
  });

  it('should build correct query with gauge', () => {
    graphqlFields.mockReturnValueOnce({ nodes: { ...minPrimitives, gauge: minPrimitives }, count: {} });
    const query = buildSectionsListQuery(options);
    expect(query).toMatchSnapshot();
  });

  it('should build correct query with region', () => {
    graphqlFields.mockReturnValueOnce({ nodes: { ...minPrimitives, region: minPrimitives }, count: {} });
    const query = buildSectionsListQuery(options);
    expect(query).toMatchSnapshot();
  });
});
