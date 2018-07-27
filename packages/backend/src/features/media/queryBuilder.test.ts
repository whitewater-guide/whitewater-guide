import db from '@db';
import { EDITOR_GA_EC } from '@seeds/01_users';
import { fakeContext } from '@test';
import { GraphQLResolveInfo } from 'graphql';
import gqf from 'graphql-fields';
import { buildMediaListQuery, buildMediaQuery } from './queryBuilder';

const graphqlFields: jest.Mock<any> = gqf as any;
jest.mock('graphql-fields', () => jest.fn());

const primitives = {
  __typename: {},
  id: {},
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

const options = { info, context: fakeContext(EDITOR_GA_EC), knex: db(true) };

it('should build node query', () => {
  const query = buildMediaQuery(options);
  expect(query).toMatchSnapshot();
});

it('should build list query', () => {
  const query = buildMediaListQuery(options);
  expect(query).toMatchSnapshot();
});
