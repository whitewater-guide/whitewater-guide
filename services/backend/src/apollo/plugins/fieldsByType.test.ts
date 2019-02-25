import { parse } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';
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

const schema = makeExecutableSchema({ typeDefs });

const getFieldsByType = (query: string) => fieldsByType(parse(query), schema);

it('should be correct for simple query', () => {
  const query = `{
    me {
      id
      firstName
      __typename
    }
  }`;
  expect(getFieldsByType(query)).toEqual(
    new Map([
      ['Query', new Set(['me'])],
      ['Person', new Set(['id', 'firstName'])],
    ]),
  );
});

it('should be correct for query with lists', () => {
  const query = `{
    people {
      id
      firstName
      __typename
    }
  }`;
  expect(getFieldsByType(query)).toEqual(
    new Map([
      ['Query', new Set(['people'])],
      ['Person', new Set(['id', 'firstName'])],
    ]),
  );
});

it('should be correct for query with multiple root-level resolvers', () => {
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
  expect(getFieldsByType(query)).toEqual(
    new Map([
      ['Query', new Set(['people', 'me'])],
      ['Person', new Set(['id', 'firstName', 'lastName'])],
    ]),
  );
});

it('should be correct for query with deep nesting', () => {
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
  expect(getFieldsByType(query)).toEqual(
    new Map([
      ['Query', new Set(['me'])],
      ['Person', new Set(['id', 'firstName', 'lastName', 'books'])],
      ['Book', new Set(['id', 'author'])],
    ]),
  );
});

it('should be correct for query with named fragments', () => {
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
  expect(getFieldsByType(query)).toEqual(
    new Map([
      ['Query', new Set(['me'])],
      ['Person', new Set(['id', 'firstName', 'lastName', 'books'])],
      ['Book', new Set(['id', 'author'])],
    ]),
  );
});

it('should return correct result for simple mutation', () => {
  const mutation = `mutation addBook {
    addBook {
      id
      firstName
      __typename
    }
  }`;
  expect(getFieldsByType(mutation)).toEqual(
    new Map([
      ['Mutation', new Set(['addBook'])],
      ['Person', new Set(['id', 'firstName'])],
    ]),
  );
});

it('should return correct result for mutation with fragments', () => {
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
  expect(getFieldsByType(mutation)).toEqual(
    new Map([
      ['Mutation', new Set(['addBook'])],
      ['Person', new Set(['id', 'firstName', 'lastName'])],
    ]),
  );
});
