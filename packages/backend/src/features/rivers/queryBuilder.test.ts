import { GraphQLResolveInfo } from 'graphql';
import gqf from 'graphql-fields';
import db from '../../db';
import { EDITOR_GA_EC } from '../../seeds/test/01_users';
import { fakeContext } from '../../test/context';
import { buildRiverQuery, buildRiversListQuery } from './queryBuilder';

const graphqlFields: jest.Mock<any> = gqf as any;
jest.mock('graphql-fields', () => jest.fn());

const primitives = {
  __typename: {},
  id: {},
  name: {},
  altNames: {},
  createdAt: {},
  updatedAt: {},
};

const withSectionsCount = {
  ...primitives,
  sections: {
    count: {},
  },
};

const withSections = {
  ...primitives,
  sections: {
    nodes: {
      __typename: {},
      id: {},
      name: {},
    },
    count: {},
  },
};

const withRegion = {
  ...primitives,
  region: {
    id: {},
    name: {},
  },
};

const info: GraphQLResolveInfo = {} as any;

const options = { info, context: fakeContext(EDITOR_GA_EC), knex: db(true) };

describe('details', () => {
  it('should build correct query without connections', () => {
    graphqlFields.mockReturnValueOnce(primitives);
    const query = buildRiverQuery(options);
    expect(query).toMatchSnapshot();
  });

  it('should build correct query with region', () => {
    graphqlFields.mockReturnValueOnce(withRegion);
    const query = buildRiverQuery(options);
    expect(query).toMatchSnapshot();
  });

  it('should build correct query with sections connection', () => {
    graphqlFields.mockReturnValueOnce(withSections);
    const query = buildRiverQuery(options);
    expect(query).toMatchSnapshot();
  });

});

describe('list', () => {
  it('should build correct query without connections', () => {
    graphqlFields.mockReturnValueOnce({ nodes: primitives, count: {} });
    const query = buildRiversListQuery(options);
    expect(query).toMatchSnapshot();
  });

  it('should build correct query with region', () => {
    graphqlFields.mockReturnValueOnce({ nodes: withRegion, count: {} });
    const query = buildRiversListQuery(options);
    expect(query).toMatchSnapshot();
  });

  it('should build correct query with sections connection', () => {
    graphqlFields.mockReturnValueOnce({ nodes: withSectionsCount, count: {} });
    const query = buildRiversListQuery(options);
    expect(query).toMatchSnapshot();
  });

});
