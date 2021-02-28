import { PlaygroundConfig } from 'apollo-server-koa';
import { getIntrospectionQuery, graphql, GraphQLSchema } from 'graphql';
import {
  FieldFilter,
  FilterObjectFields,
  FilterRootFields,
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

const getPlaygroundSchema = (schema: GraphQLSchema) => {
  const filterRootFields = new FilterRootFields(adminFieldsFilter);
  const filterAdminFields = new FilterObjectFields(adminFieldsFilter);
  return filterAdminFields.transformSchema(
    filterRootFields.transformSchema(schema),
  );
};

export const getPlaygroundConfig = async (
  schema: GraphQLSchema,
): Promise<PlaygroundConfig> => {
  const introspectionQuery = getIntrospectionQuery();
  const playgroundSchema = getPlaygroundSchema(schema);
  const { data } = await graphql(
    playgroundSchema,
    introspectionQuery,
    undefined,
  );
  if (!data) {
    throw new Error('failed to run introspection query');
  }
  return {
    schema: data,
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
};
