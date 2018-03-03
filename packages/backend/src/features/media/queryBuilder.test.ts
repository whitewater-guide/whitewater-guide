import gqf = require('graphql-fields');
import { GraphQLResolveInfo } from 'graphql';
import db from '../../db';
import { adminContext } from '../../test/context';
import { buildMediaListQuery, buildMediaQuery } from './queryBuilder';

const graphqlFields: jest.Mock<any> = gqf as any;
jest.mock('graphql-fields', () => jest.fn());

const primitives = {
  __typename: {},
  id: {},
  language: {},
  description: {},
  copyright: {},
  kind: {},
  url: {},
  resolution: {},
  createdAt: {},
  updatedAt: {},
};
graphqlFields.mockReturnValue(primitives);

const info: GraphQLResolveInfo = {} as any;

const options = { info, context: adminContext, knex: db(true) };

it('should build node query', () => {
  const query = buildMediaQuery(options);
  expect(query).toMatchSnapshot();
});

it('should build list query', () => {
  const query = buildMediaListQuery(options);
  expect(query).toMatchSnapshot();
});
