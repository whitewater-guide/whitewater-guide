import { ApolloServerPluginLandingPageGraphQLPlaygroundOptions } from 'apollo-server-core';
import { getIntrospectionQuery, graphql, GraphQLSchema } from 'graphql';
import {
  FieldFilter,
  FilterObjectFields,
  FilterRootFields,
  FilterTypes,
  wrapSchema,
} from 'graphql-tools';

const adminFieldsFilter: FieldFilter = (operation, fieldName, field) => {
  if (operation === 'Mutation') {
    return false;
  }
  const isAdmin = field?.astNode?.directives?.some(
    (d) => d.name.value === 'admin',
  );
  return !isAdmin;
};

function getPlaygroundSchema(schema: GraphQLSchema): GraphQLSchema {
  return wrapSchema({
    schema,
    transforms: [
      new FilterTypes((type) => {
        return type.name !== 'Mutation';
      }),
      new FilterRootFields(adminFieldsFilter),
      new FilterObjectFields(adminFieldsFilter),
    ],
  });
}

export async function getPlaygroundConfig(
  schema: GraphQLSchema,
): Promise<ApolloServerPluginLandingPageGraphQLPlaygroundOptions> {
  const playgroundSchema = getPlaygroundSchema(schema);
  const { data } = await graphql(playgroundSchema, getIntrospectionQuery());
  if (!data) {
    throw new Error('failed to run introspection query');
  }
  return {
    schema: data as any,
    tabs: [
      {
        name: 'Example: some regions',
        endpoint: '',
        query: `
        query listRegions($page: Page) {
          regions(page: $page) {
            nodes {
              id
              name
              premium
              hasPremiumAccess
              editable
              sku
              rivers {
                count
              }
              gauges {
                count
              }
              sections {
                count
              }
            }
            count
          }
        }
       `,
        variables: JSON.stringify({ page: { limit: 5 } }),
      } as any,
    ],
  };
}
