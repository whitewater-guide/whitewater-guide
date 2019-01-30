import { graphql } from 'graphql';
import {
  addSchemaLevelResolveFunction,
  makeExecutableSchema,
} from 'graphql-tools';
import { fieldsByType } from './fieldsByType';

const typeDefs = `
  type Person {
    id: Int!
    firstName: String!
    lastName: String
    books: [Book]!
  }
  type Book {
    id: Int!
    title: String!
    author: Person!
  }
  type Query {
    me: Person
    people: [Person]!
    books: [Book]!
  }
  type Mutation {
    addBook: Person
  }
`;

let result: any;
const schema = makeExecutableSchema({ typeDefs });
addSchemaLevelResolveFunction(schema, (source, args, context, info) => {
  result = fieldsByType(info);
});

beforeEach(() => {
  result = null;
});

it('should be correct for simple query', async () => {
  const query = `{
    me {
      id
      firstName
      __typename
    }
  }`;
  await graphql(schema, query);
  expect(result).toEqual(
    new Map([
      ['Query', new Set(['me'])],
      ['Person', new Set(['id', 'firstName'])],
    ]),
  );
});

it('should be correct for query with lists', async () => {
  const query = `{
    people {
      id
      firstName
      __typename
    }
  }`;
  await graphql(schema, query);
  expect(result).toEqual(
    new Map([
      ['Query', new Set(['people'])],
      ['Person', new Set(['id', 'firstName'])],
    ]),
  );
});

it('should be correct for query with multiple root-level resolvers', async () => {
  const query = `{
    me {
      id
      lastName
      __typename
    }
    people {
      id
      firstName
      __typename
    }
  }`;
  await graphql(schema, query);
  expect(result).toEqual(
    new Map([
      ['Query', new Set(['people', 'me'])],
      ['Person', new Set(['id', 'firstName', 'lastName'])],
    ]),
  );
});

it('should be correct for query with deep nesting', async () => {
  const query = `{
    me {
      id
      lastName
      books {
        id
        author {
          id
          firstName
          lastName
          __typename
        }
        __typename
      }
      __typename
    }
  }`;
  await graphql(schema, query);
  expect(result).toEqual(
    new Map([
      ['Query', new Set(['me'])],
      ['Person', new Set(['id', 'firstName', 'lastName', 'books'])],
      ['Book', new Set(['id', 'author'])],
    ]),
  );
});

it('should be correct for query with named fragments', async () => {
  const query = `{
    me {
      id
      lastName
      books {
        id
        author {
          ...PersonCore
          __typename
        }
        __typename
      }
      __typename
    }
  }

  fragment PersonCore on Person {
    id
    firstName
    lastName
  }
  `;
  await graphql(schema, query);
  expect(result).toEqual(
    new Map([
      ['Query', new Set(['me'])],
      ['Person', new Set(['id', 'firstName', 'lastName', 'books'])],
      ['Book', new Set(['id', 'author'])],
    ]),
  );
});

it('should return correct result for simple mutation', async () => {
  const mutation = `mutation addBook {
    addBook {
      id
      firstName
      __typename
    }
  }`;
  const { errors } = await graphql(schema, mutation);
  expect(errors).toBeUndefined();
  expect(result).toEqual(
    new Map([
      ['Mutation', new Set(['addBook'])],
      ['Person', new Set(['id', 'firstName'])],
    ]),
  );
});

it('should return correct result for mutation with fragments', async () => {
  const mutation = `mutation addBook {
    addBook {
      ...PersonCore
      __typename
    }
  }

  fragment PersonCore on Person {
    id
    firstName
    lastName
  }
  `;
  const { errors } = await graphql(schema, mutation);
  expect(errors).toBeUndefined();
  expect(result).toEqual(
    new Map([
      ['Mutation', new Set(['addBook'])],
      ['Person', new Set(['id', 'firstName', 'lastName'])],
    ]),
  );
});
