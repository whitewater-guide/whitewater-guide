import { GraphQLResolveInfo } from 'graphql';
import db from '../../db';
import { adminContext } from '../../test/context';
import { buildQuery } from './queryBuilder';
import gqf = require('graphql-fields');

const graphqlFields: jest.Mock<any> = gqf as any;

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

jest.mock('graphql-fields', () => jest.fn());

it('should build correct query without connections', () => {
  graphqlFields.mockReturnValueOnce(primitives);
  const query = buildQuery(db(true), {} as GraphQLResolveInfo, adminContext);
  const sql = query.toQuery();
  expect(sql).toMatchSnapshot();
});

it('should build correct query with connections', () => {
  graphqlFields.mockReturnValueOnce({ ...primitives, ...connections });
  const query = buildQuery(db(true), {} as GraphQLResolveInfo, adminContext);
  const sql = query.toQuery();
  expect(sql).toMatchSnapshot();
});
