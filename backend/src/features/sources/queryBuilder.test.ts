import { GraphQLResolveInfo } from 'graphql';
import db from '../../db';
import { adminContext } from '../../test/context';
import { buildQuery } from './queryBuilder';
import gqf = require('graphql-fields');

const graphqlFields: jest.Mock<any> = gqf as any;
jest.mock('graphql-fields', () => jest.fn());

const primitives = {
  __typename: {},
  id: {},
  language: {},
  name: {},
  url: {},
  script: {},
  harvestMode: {},
  cron: {},
  enabled: {},
  createdAt: {},
  updatedAt: {},
};

const connections = {
  regions: {
    nodes: {
      __typename: {},
      id: {},
      language: {},
      name: {},
    },
    count: {},
  },
};

const info: GraphQLResolveInfo = {} as any;

const options = { info, context: adminContext, knex: db(true) };

it('should build correct query without connections', () => {
  graphqlFields.mockReturnValueOnce(primitives);
  const query = buildQuery(options);
  const sql = query.toQuery();
  expect(sql).toMatchSnapshot();
});

it('should build correct query with connections', () => {
  graphqlFields.mockReturnValueOnce({ ...primitives, ...connections });
  const query = buildQuery(options);
  const sql = query.toQuery();
  expect(sql).toMatchSnapshot();
});
